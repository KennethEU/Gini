/**
 * UI Controller - Main application controller
 * Handles all user interactions and coordinates between components
 */

class UIController {
    constructor() {
        this.chartHandler = new ChartHandler();
        this.currentIncomes = null;
        this.currentChallenge = null;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.initializeTaxBrackets();
        this.updateIncomePreview();
        this.loadDefaultScenario();
        this.loadChallenge();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Preset scenario buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenario = e.target.dataset.scenario;
                this.loadScenario(scenario);
            });
        });

        // Range sliders with live value display
        this.setupRangeSlider('population', 'population-value', (val) => val);
        this.setupRangeSlider('max-income', 'max-income-value', (val) => val.toLocaleString('da-DK'));

        // Distribution type
        document.getElementById('distribution-type').addEventListener('change', () => {
            this.updateIncomePreview();
            this.autoCalculate();
        });

        // Max income slider
        document.getElementById('max-income').addEventListener('input', () => {
            this.updateIncomePreview();
        });

        // Tax profile buttons
        document.querySelectorAll('.tax-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTaxProfile(e.target.dataset.profile);
            });
        });

        // Calculate button
        document.getElementById('calculate').addEventListener('click', () => {
            this.calculate();
        });

        // Reset button
        document.getElementById('reset').addEventListener('click', () => {
            this.reset();
        });

        // Add tax bracket button
        document.getElementById('add-bracket').addEventListener('click', () => {
            this.addTaxBracket();
        });

        // Auto-calculate on slider changes (debounced)
        let autoCalcTimeout;
        ['population', 'max-income'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                clearTimeout(autoCalcTimeout);
                autoCalcTimeout = setTimeout(() => this.autoCalculate(), 500);
            });
        });
    }

    /**
     * Setup range slider with value display
     */
    setupRangeSlider(sliderId, valueId, formatter) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);

        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = formatter(parseInt(e.target.value));
        });
    }

    /**
     * Initialize default tax brackets
     */
    initializeTaxBrackets() {
        const defaultBrackets = [
            { threshold: 50000, rate: 8 },
            { threshold: 200000, rate: 12 },
            { threshold: 400000, rate: 15 }
        ];

        const container = document.getElementById('tax-brackets');
        container.innerHTML = '';

        defaultBrackets.forEach((bracket, index) => {
            this.addTaxBracketElement(bracket.threshold, bracket.rate, index);
        });
    }

    /**
     * Add a new tax bracket to the UI
     */
    addTaxBracket() {
        const brackets = this.getTaxBrackets();
        const lastThreshold = brackets.length > 0 ? brackets[brackets.length - 1].threshold : 0;

        this.addTaxBracketElement(lastThreshold + 100000, 20, brackets.length);
    }

    /**
     * Add tax bracket element to DOM
     */
    addTaxBracketElement(threshold, rate, index) {
        const container = document.getElementById('tax-brackets');
        const bracketDiv = document.createElement('div');
        bracketDiv.className = 'tax-bracket';
        bracketDiv.innerHTML = `
            <div class="bracket-header">
                <span class="bracket-label">Skattetrin ${container.children.length + 1}</span>
                <button class="remove-bracket-btn" title="Fjern skattetrin">×</button>
            </div>
            <div class="bracket-inputs">
                <div class="input-group">
                    <label>De næste X kroner:</label>
                    <input type="number"
                           placeholder="fx 50000"
                           value="${threshold}"
                           min="0"
                           step="10000"
                           class="threshold-input">
                </div>
                <div class="input-group">
                    <label>Beskattes med:</label>
                    <input type="number"
                           placeholder="fx 15"
                           value="${rate}"
                           min="0"
                           max="100"
                           step="1"
                           class="rate-input">
                    <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">%</span>
                </div>
            </div>
        `;

        // Remove button handler
        bracketDiv.querySelector('.remove-bracket-btn').addEventListener('click', () => {
            bracketDiv.remove();
            this.renumberBrackets();
            this.updateTaxExample();
            this.autoCalculate();
        });

        // Auto-calculate on change
        bracketDiv.querySelectorAll('input').forEach(input => {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.updateTaxExample();
                    this.autoCalculate();
                }, 500);
            });
        });

        container.appendChild(bracketDiv);
        this.updateTaxExample();
    }

    /**
     * Renumber bracket labels after deletion
     */
    renumberBrackets() {
        const brackets = document.querySelectorAll('.tax-bracket');
        brackets.forEach((bracket, index) => {
            const label = bracket.querySelector('.bracket-label');
            if (label) {
                label.textContent = `Skattetrin ${index + 1}`;
            }
        });
    }

    /**
     * Get current tax brackets from UI
     */
    getTaxBrackets() {
        const brackets = [];
        document.querySelectorAll('.tax-bracket').forEach(bracket => {
            const threshold = parseInt(bracket.querySelector('.threshold-input').value) || 0;
            const rate = parseInt(bracket.querySelector('.rate-input').value) || 0;
            brackets.push({ threshold, rate });
        });
        return brackets;
    }

    /**
     * Load a preset scenario
     */
    loadScenario(scenarioName) {
        const scenario = Scenarios.getScenario(scenarioName);

        // Update population settings
        document.getElementById('population').value = scenario.population;
        document.getElementById('population-value').textContent = scenario.population;

        // Calculate max income from groups and groupSpan
        const maxIncome = scenario.groups * scenario.groupSpan;
        document.getElementById('max-income').value = maxIncome;
        document.getElementById('max-income-value').textContent = maxIncome.toLocaleString('da-DK');

        // Update distribution type
        document.getElementById('distribution-type').value = scenario.distributionType;

        // Update income preview
        this.updateIncomePreview();

        // Update tax brackets
        const container = document.getElementById('tax-brackets');
        container.innerHTML = '';
        scenario.taxBrackets.forEach((bracket, index) => {
            this.addTaxBracketElement(bracket.threshold, bracket.rate, index);
        });

        // Calculate immediately
        this.calculate();

        // Show educational info
        this.showScenarioInfo(scenarioName);
    }

    /**
     * Show educational information about scenario
     */
    showScenarioInfo(scenarioName) {
        const info = Scenarios.getEducationalInfo(scenarioName);
        // Could show this in a modal or info panel
        console.log('Scenario info:', info);
    }

    /**
     * Load default scenario
     */
    loadDefaultScenario() {
        this.loadScenario('denmark');
    }

    /**
     * Select a tax profile
     */
    selectTaxProfile(profile) {
        // Update active button
        document.querySelectorAll('.tax-profile-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-profile="${profile}"]`).classList.add('active');

        // Clear existing brackets
        const container = document.getElementById('tax-brackets');
        container.innerHTML = '';

        // Show/hide warnings and explanations
        const flatWarning = document.getElementById('flat-tax-warning');
        const taxExplanation = document.getElementById('tax-explanation');

        // Load profile brackets
        switch(profile) {
            case 'none':
                // No brackets - no tax
                this.addTaxBracketElement(99999999, 0, 0);
                flatWarning.style.display = 'none';
                taxExplanation.style.display = 'none';
                break;
            case 'flat':
                // Flat 25% tax on everything
                this.addTaxBracketElement(99999999, 25, 0);
                flatWarning.style.display = 'block';
                taxExplanation.style.display = 'none';
                break;
            case 'progressive':
                // Default progressive system
                this.addTaxBracketElement(50000, 8, 0);
                this.addTaxBracketElement(200000, 12, 1);
                this.addTaxBracketElement(400000, 15, 2);
                flatWarning.style.display = 'none';
                taxExplanation.style.display = 'block';
                break;
        }

        this.updateTaxExample();
        this.autoCalculate();
    }

    /**
     * Update income preview box
     */
    updateIncomePreview() {
        const maxIncome = parseInt(document.getElementById('max-income').value);
        const distributionType = document.getElementById('distribution-type').value;
        const population = parseInt(document.getElementById('population').value);

        // Calculate typical incomes based on distribution
        let lowest, median, highest;

        switch(distributionType) {
            case 'equal':
                lowest = Math.floor(maxIncome * 0.8);
                median = Math.floor(maxIncome * 0.9);
                highest = maxIncome;
                break;
            case 'normal':
                lowest = Math.floor(maxIncome * 0.2);
                median = Math.floor(maxIncome * 0.5);
                highest = maxIncome;
                break;
            case 'skewed':
                lowest = 0;
                median = Math.floor(maxIncome * 0.3);
                highest = maxIncome;
                break;
            case 'extreme':
                lowest = 0;
                median = Math.floor(maxIncome * 0.15);
                highest = maxIncome;
                break;
        }

        document.getElementById('preview-values').innerHTML = `
            <span class="preview-item">Laveste: <strong>${lowest.toLocaleString('da-DK')} kr</strong></span>
            <span class="preview-item">Median: <strong>${median.toLocaleString('da-DK')} kr</strong></span>
            <span class="preview-item">Højeste: <strong>${highest.toLocaleString('da-DK')} kr</strong></span>
        `;
    }

    /**
     * Update tax example calculation
     */
    updateTaxExample() {
        const brackets = this.getTaxBrackets();
        if (brackets.length === 0) {
            document.getElementById('example-text').innerHTML = 'Tilføj skattetrin for at se eksempel';
            return;
        }

        const exampleIncome = 500000;
        let totalTax = 0;
        let remainingIncome = exampleIncome;
        let steps = [];

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;

            const taxableAmount = Math.min(bracket.threshold, remainingIncome);
            const tax = Math.floor(taxableAmount * (bracket.rate / 100));
            totalTax += tax;

            steps.push(`<li>De næste ${taxableAmount.toLocaleString('da-DK')} kr: ${bracket.rate}% = ${tax.toLocaleString('da-DK')} kr</li>`);

            remainingIncome -= bracket.threshold;
        }

        const effectiveRate = ((totalTax / exampleIncome) * 100).toFixed(1);
        const afterTax = exampleIncome - totalTax;

        document.getElementById('example-text').innerHTML = `
            En person der tjener <strong>${exampleIncome.toLocaleString('da-DK')} kr</strong> betaler:
            <ul>${steps.join('')}</ul>
            <strong>Total skat: ${totalTax.toLocaleString('da-DK')} kr (${effectiveRate}%)</strong><br>
            <strong>Efter skat: ${afterTax.toLocaleString('da-DK')} kr</strong>
        `;
    }

    /**
     * Load a random challenge
     */
    loadChallenge() {
        this.currentChallenge = ChallengeGenerator.getRandomChallenge();
        document.getElementById('challenge-text').textContent = this.currentChallenge.text;
    }

    /**
     * Calculate Gini coefficients and update charts
     */
    calculate() {
        // Get parameters from UI
        const population = parseInt(document.getElementById('population').value);
        const maxIncome = parseInt(document.getElementById('max-income').value);
        const distributionType = document.getElementById('distribution-type').value;

        // Fixed number of groups (10 is good for visualization)
        const groups = 10;
        const groupSpan = Math.floor(maxIncome / groups);

        // Generate group sizes
        const groupSizes = DistributionTemplates.getGroupSizes(distributionType, population, groups);

        // Create income distribution
        const distribution = new IncomeDistribution(groups, groupSpan, groupSizes);
        this.currentIncomes = distribution.getIncomes();

        // Get tax brackets
        const brackets = this.getTaxBrackets();
        const bracketArray = Scenarios.bracketsToArray(brackets);

        // Apply taxes and calculate
        const results = TaxSystem.applyTaxes(this.currentIncomes, bracketArray);

        // Update charts and displays
        this.chartHandler.updateCharts(results);
        this.chartHandler.animateUpdate();

        // Check challenge completion
        if (this.currentChallenge) {
            this.checkChallengeCompletion(results);
        }

        // Log results for debugging
        console.log('Calculation results:', {
            population: population,
            giniBefore: results.giniBefore,
            giniAfter: results.giniAfter,
            reduction: results.giniChange,
            reductionPercent: results.giniChangePercent.toFixed(1) + '%'
        });
    }

    /**
     * Auto-calculate (called on parameter changes)
     */
    autoCalculate() {
        // Only auto-calculate if we already have data
        if (this.currentIncomes !== null) {
            this.calculate();
        }
    }

    /**
     * Check if current challenge is completed
     */
    checkChallengeCompletion(results) {
        if (ChallengeGenerator.checkChallenge(this.currentChallenge.id, results)) {
            this.showChallengeCompleted();
        }
    }

    /**
     * Show challenge completed message
     */
    showChallengeCompleted() {
        const challengeBox = document.querySelector('.challenge-box');
        challengeBox.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
        challengeBox.style.borderColor = '#10b981';

        setTimeout(() => {
            this.loadChallenge();
            challengeBox.style.background = '';
            challengeBox.style.borderColor = '';
        }, 3000);
    }

    /**
     * Reset all settings
     */
    reset() {
        // Reset to default scenario
        this.loadDefaultScenario();

        // Clear charts
        this.chartHandler.resetCharts();

        // Reset current data
        this.currentIncomes = null;

        // Load new challenge
        this.loadChallenge();
    }

    /**
     * Export current data as CSV
     */
    exportData() {
        if (!this.currentIncomes) {
            alert('Ingen data at eksportere. Beregn først!');
            return;
        }

        // Create CSV content
        let csv = 'Person,Indkomst Før Skat,Indkomst Efter Skat,Skat Betalt\n';

        const brackets = this.getTaxBrackets();
        const bracketArray = Scenarios.bracketsToArray(brackets);
        const results = TaxSystem.applyTaxes(this.currentIncomes, bracketArray);

        results.taxpayers.forEach((tp, index) => {
            csv += `${index + 1},${tp.getIncome()},${tp.getIncomeAfterTax()},${tp.getTotalTax()}\n`;
        });

        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gini-data.csv';
        a.click();
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UIController();
    console.log('Gini Simulator loaded successfully!');
});
