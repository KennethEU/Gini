/**
 * Gini Coefficient Calculator
 * Ported from Java to JavaScript
 */

class GiniCalculator {
    /**
     * Calculate Gini coefficient for an income array
     * @param {number[]} incomes - Array of income values (must be sorted)
     * @returns {number} - Gini coefficient (0-1)
     */
    static calculateGini(incomes) {
        const cumulativeIncomes = this.getCumulativeIncomes(incomes);
        const line45 = this.makeLine45(incomes);
        const giniCoef = this.calcGiniCoef(incomes, cumulativeIncomes, line45);
        return giniCoef;
    }

    /**
     * Calculate cumulative income distribution (Lorenz curve)
     * @param {number[]} incomes - Sorted array of incomes
     * @returns {number[]} - Cumulative income proportions
     */
    static getCumulativeIncomes(incomes) {
        const cumulativeArray = [];
        let prevSum = 0;
        const totalSum = incomes.reduce((acc, income) => acc + income, 0);

        for (let i = 0; i < incomes.length; i++) {
            cumulativeArray[i] = (prevSum + incomes[i]) / totalSum;
            prevSum += incomes[i];
        }

        return cumulativeArray;
    }

    /**
     * Create 45-degree line (perfect equality line)
     * @param {number[]} incomes - Income array
     * @returns {number[]} - Perfect equality distribution
     */
    static makeLine45(incomes) {
        const line45 = [];
        for (let i = 0; i < incomes.length; i++) {
            line45[i] = (i + 1) / incomes.length;
        }
        return line45;
    }

    /**
     * Calculate Gini coefficient from cumulative incomes and equality line
     * @param {number[]} incomes - Income array
     * @param {number[]} cumulativeIncomes - Lorenz curve values
     * @param {number[]} line45 - Perfect equality line
     * @returns {number} - Gini coefficient
     */
    static calcGiniCoef(incomes, cumulativeIncomes, line45) {
        const areaA = [];

        for (let i = 0; i < incomes.length; i++) {
            areaA[i] = line45[i] - cumulativeIncomes[i];
        }

        const sumA = areaA.reduce((acc, val) => acc + val, 0);
        const sumCumulative = cumulativeIncomes.reduce((acc, val) => acc + val, 0);

        return sumA / (sumCumulative + sumA);
    }

    /**
     * Get Lorenz curve data for charting
     * @param {number[]} incomes - Sorted income array
     * @returns {object} - Object with lorenz curve and equality line data
     */
    static getLorenzCurveData(incomes) {
        const cumulativeIncomes = this.getCumulativeIncomes(incomes);
        const line45 = this.makeLine45(incomes);

        // Add (0,0) point at start for proper chart display
        const lorenzX = [0, ...line45.map((_, i) => (i + 1) / incomes.length)];
        const lorenzY = [0, ...cumulativeIncomes];
        const equalityY = [0, ...line45];

        return {
            lorenzX,
            lorenzY,
            equalityY
        };
    }
}

/**
 * Income Distribution Generator
 */
class IncomeDistribution {
    /**
     * Create income distribution
     * @param {number} groups - Number of income groups (e.g., 10 for deciles)
     * @param {number} groupSpan - Income range per group
     * @param {number[]} groupSizes - Number of people in each group
     */
    constructor(groups, groupSpan, groupSizes) {
        this.groups = groups;
        this.groupSpan = groupSpan;
        this.groupSizes = groupSizes;
        this.incomes = this.makeIncomeDistribution();
    }

    /**
     * Generate income distribution with random variation
     * @returns {number[]} - Sorted array of incomes
     */
    makeIncomeDistribution() {
        const incomes = [];

        for (let i = 0; i < this.groups; i++) {
            const min = i * this.groupSpan;
            const max = (i * this.groupSpan) + this.groupSpan;

            for (let j = 0; j < this.groupSizes[i]; j++) {
                const income = Math.floor(Math.random() * (max - min + 1) + min);
                incomes.push(income);
            }
        }

        return incomes.sort((a, b) => a - b);
    }

    getIncomes() {
        return this.incomes;
    }

    getTotalPeople() {
        return this.groupSizes.reduce((acc, size) => acc + size, 0);
    }
}

/**
 * Tax Payer - Calculate taxes for an individual
 */
class TaxPayer {
    /**
     * Create taxpayer and calculate their tax
     * @param {number} income - Pre-tax income
     * @param {number[]} brackets - Tax brackets [threshold1, rate1, threshold2, rate2, ...]
     */
    constructor(income, brackets) {
        this.income = income;
        this.totalTax = 0;
        this.calculateTax(brackets);
        this.incomeAfterTax = this.income - this.totalTax;
    }

    /**
     * Calculate progressive tax
     * @param {number[]} brackets - Tax brackets and rates
     */
    calculateTax(brackets) {
        let remainingIncome = this.income;

        for (let i = 0; i < brackets.length; i += 2) {
            const threshold = brackets[i];
            const rate = brackets[i + 1];

            if (remainingIncome > threshold) {
                const taxableAmount = Math.min(threshold, remainingIncome);
                this.totalTax += this.taxIncome(taxableAmount, rate);
                remainingIncome -= threshold;
            } else {
                // Tax the remaining income and exit
                this.totalTax += this.taxIncome(remainingIncome, rate);
                break;
            }
        }
    }

    /**
     * Calculate tax on amount
     * @param {number} amount - Amount to tax
     * @param {number} percentage - Tax rate percentage
     * @returns {number} - Tax amount
     */
    taxIncome(amount, percentage) {
        return Math.floor(amount * (percentage / 100));
    }

    getIncome() {
        return this.income;
    }

    getIncomeAfterTax() {
        return this.incomeAfterTax;
    }

    getTotalTax() {
        return this.totalTax;
    }
}

/**
 * Tax System Manager - Apply taxes to entire population
 */
class TaxSystem {
    /**
     * Apply tax system to income distribution
     * @param {number[]} incomes - Pre-tax incomes
     * @param {number[]} brackets - Tax brackets
     * @returns {object} - Object with pre-tax and post-tax data
     */
    static applyTaxes(incomes, brackets) {
        const taxpayers = incomes.map(income => new TaxPayer(income, brackets));
        const incomesAfterTax = taxpayers.map(tp => tp.getIncomeAfterTax()).sort((a, b) => a - b);

        const giniBefore = GiniCalculator.calculateGini(incomes);
        const giniAfter = GiniCalculator.calculateGini(incomesAfterTax);

        return {
            incomesBefore: incomes,
            incomesAfter: incomesAfterTax,
            taxpayers: taxpayers,
            giniBefore: giniBefore,
            giniAfter: giniAfter,
            giniChange: giniBefore - giniAfter,
            giniChangePercent: ((giniBefore - giniAfter) / giniBefore) * 100
        };
    }
}

/**
 * Distribution Templates
 */
class DistributionTemplates {
    /**
     * Generate group sizes based on distribution type
     * @param {string} type - Distribution type
     * @param {number} totalPeople - Total number of people
     * @param {number} groups - Number of groups
     * @returns {number[]} - Array of group sizes
     */
    static getGroupSizes(type, totalPeople, groups) {
        switch (type) {
            case 'equal':
                return this.equalDistribution(totalPeople, groups);
            case 'normal':
                return this.normalDistribution(totalPeople, groups);
            case 'skewed':
                return this.skewedDistribution(totalPeople, groups);
            case 'extreme':
                return this.extremeDistribution(totalPeople, groups);
            default:
                return this.equalDistribution(totalPeople, groups);
        }
    }

    /**
     * Equal distribution - same number in each group
     */
    static equalDistribution(totalPeople, groups) {
        const perGroup = Math.floor(totalPeople / groups);
        const remainder = totalPeople % groups;
        const sizes = new Array(groups).fill(perGroup);
        // Distribute remainder to last groups
        for (let i = 0; i < remainder; i++) {
            sizes[groups - 1 - i]++;
        }
        return sizes;
    }

    /**
     * Normal distribution - bell curve
     */
    static normalDistribution(totalPeople, groups) {
        const sizes = [];
        const mid = groups / 2;

        for (let i = 0; i < groups; i++) {
            const distance = Math.abs(i - mid);
            const weight = Math.exp(-(distance * distance) / (2 * (groups / 4) ** 2));
            sizes.push(weight);
        }

        return this.normalizeToTotal(sizes, totalPeople);
    }

    /**
     * Skewed distribution - more people in lower income groups (realistic)
     */
    static skewedDistribution(totalPeople, groups) {
        const sizes = [];

        for (let i = 0; i < groups; i++) {
            // Exponential decay - more people in lower income groups
            const weight = Math.exp(-i / (groups / 3));
            sizes.push(weight);
        }

        return this.normalizeToTotal(sizes, totalPeople);
    }

    /**
     * Extreme inequality - very few wealthy, many poor
     */
    static extremeDistribution(totalPeople, groups) {
        const sizes = [];

        for (let i = 0; i < groups; i++) {
            // Sharp exponential decay
            const weight = Math.exp(-i / (groups / 5));
            sizes.push(weight);
        }

        return this.normalizeToTotal(sizes, totalPeople);
    }

    /**
     * Normalize weights to match total people
     */
    static normalizeToTotal(weights, total) {
        const sum = weights.reduce((acc, w) => acc + w, 0);
        const normalized = weights.map(w => Math.round((w / sum) * total));

        // Adjust for rounding errors
        const currentTotal = normalized.reduce((acc, n) => acc + n, 0);
        const diff = total - currentTotal;

        if (diff !== 0) {
            // Add or subtract from largest group
            const maxIndex = normalized.indexOf(Math.max(...normalized));
            normalized[maxIndex] += diff;
        }

        return normalized;
    }
}
