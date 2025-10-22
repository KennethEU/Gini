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
        this.setupRangeSlider('groups', 'groups-value', (val) => val);
        this.setupRangeSlider('group-span', 'span-value', (val) => val.toLocaleString('da-DK'));

        // Distribution type
        document.getElementById('distribution-type').addEventListener('change', () => {
            this.autoCalculate();
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
        ['population', 'groups', 'group-span'].forEach(id => {
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
            <input type="number"
                   placeholder="Tærskel (kr)"
                   value="${threshold}"
                   min="0"
                   step="10000"
                   class="threshold-input">
            <input type="number"
                   placeholder="Sats (%)"
                   value="${rate}"
                   min="0"
                   max="100"
                   step="1"
                   class="rate-input">
            <button class="remove-bracket" title="Fjern skattetrin">×</button>
        `;

        // Remove button handler
        bracketDiv.querySelector('.remove-bracket').addEventListener('click', () => {
            bracketDiv.remove();
            this.autoCalculate();
        });

        // Auto-calculate on change
        bracketDiv.querySelectorAll('input').forEach(input => {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.autoCalculate(), 500);
            });
        });

        container.appendChild(bracketDiv);
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

        document.getElementById('groups').value = scenario.groups;
        document.getElementById('groups-value').textContent = scenario.groups;

        document.getElementById('group-span').value = scenario.groupSpan;
        document.getElementById('span-value').textContent = scenario.groupSpan.toLocaleString('da-DK');

        // Update distribution type
        document.getElementById('distribution-type').value = scenario.distributionType;

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
        const groups = parseInt(document.getElementById('groups').value);
        const groupSpan = parseInt(document.getElementById('group-span').value);
        const distributionType = document.getElementById('distribution-type').value;

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
