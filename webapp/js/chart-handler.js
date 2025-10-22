/**
 * Chart Handler - Manages Chart.js visualizations
 */

class ChartHandler {
    constructor() {
        this.chartBefore = null;
        this.chartAfter = null;
        this.initCharts();
    }

    /**
     * Initialize both charts
     */
    initCharts() {
        const ctxBefore = document.getElementById('chart-before').getContext('2d');
        const ctxAfter = document.getElementById('chart-after').getContext('2d');

        // Chart configuration
        const config = (title) => ({
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Lorenz-kurve',
                        data: [],
                        borderColor: 'rgb(37, 99, 235)',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Perfekt lighed',
                        data: [],
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.2,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += (context.parsed.y * 100).toFixed(1) + '%';
                                return label;
                            },
                            title: function(context) {
                                return 'Befolkning: ' + (context[0].parsed.x * 100).toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Kumulativ andel af befolkningen (%)',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            },
                            stepSize: 0.1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Kumulativ andel af indkomst (%)',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            },
                            stepSize: 0.1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        this.chartBefore = new Chart(ctxBefore, config('Før skat'));
        this.chartAfter = new Chart(ctxAfter, config('Efter skat'));
    }

    /**
     * Update chart with new income data
     * @param {Chart} chart - Chart.js instance
     * @param {number[]} incomes - Income array
     */
    updateChart(chart, incomes) {
        const lorenzData = GiniCalculator.getLorenzCurveData(incomes);

        // Update chart data
        chart.data.labels = lorenzData.lorenzX;
        chart.data.datasets[0].data = lorenzData.lorenzX.map((x, i) => ({
            x: x,
            y: lorenzData.lorenzY[i]
        }));
        chart.data.datasets[1].data = lorenzData.lorenzX.map((x, i) => ({
            x: x,
            y: lorenzData.equalityY[i]
        }));

        chart.update('none'); // Update without animation for better performance
    }

    /**
     * Update both charts with tax calculation results
     * @param {object} results - Results from TaxSystem.applyTaxes()
     */
    updateCharts(results) {
        // Update before tax chart
        this.updateChart(this.chartBefore, results.incomesBefore);
        document.getElementById('gini-before').textContent = results.giniBefore.toFixed(3);

        // Update after tax chart
        this.updateChart(this.chartAfter, results.incomesAfter);
        document.getElementById('gini-after').textContent = results.giniAfter.toFixed(3);

        // Update Gini change display
        this.updateGiniChange(results.giniChange, results.giniChangePercent);

        // Color code Gini displays based on value
        this.colorCodeGiniDisplay('gini-before', results.giniBefore);
        this.colorCodeGiniDisplay('gini-after', results.giniAfter);
    }

    /**
     * Update Gini change indicator
     * @param {number} change - Absolute change in Gini
     * @param {number} changePercent - Percentage change
     */
    updateGiniChange(change, changePercent) {
        const changeElement = document.getElementById('gini-change');

        if (Math.abs(change) < 0.001) {
            changeElement.textContent = 'Ingen ændring';
            changeElement.className = 'gini-change';
        } else if (change > 0) {
            changeElement.textContent = `↓ Reduktion: ${change.toFixed(3)} (${changePercent.toFixed(1)}%)`;
            changeElement.className = 'gini-change positive';
        } else {
            changeElement.textContent = `↑ Stigning: ${Math.abs(change).toFixed(3)} (${Math.abs(changePercent).toFixed(1)}%)`;
            changeElement.className = 'gini-change negative';
        }
    }

    /**
     * Color code Gini display based on value
     * @param {string} elementId - Element ID
     * @param {number} gini - Gini coefficient
     */
    colorCodeGiniDisplay(elementId, gini) {
        const element = document.getElementById(elementId);

        // Color based on inequality level
        if (gini < 0.25) {
            element.style.color = '#10b981'; // Green - low inequality
        } else if (gini < 0.35) {
            element.style.color = '#3b82f6'; // Blue - moderate
        } else if (gini < 0.45) {
            element.style.color = '#f59e0b'; // Orange - high
        } else {
            element.style.color = '#ef4444'; // Red - very high
        }
    }

    /**
     * Animate chart update
     */
    animateUpdate() {
        this.chartBefore.update('active');
        this.chartAfter.update('active');
    }

    /**
     * Reset charts to empty state
     */
    resetCharts() {
        this.chartBefore.data.labels = [];
        this.chartBefore.data.datasets[0].data = [];
        this.chartBefore.data.datasets[1].data = [];
        this.chartBefore.update();

        this.chartAfter.data.labels = [];
        this.chartAfter.data.datasets[0].data = [];
        this.chartAfter.data.datasets[1].data = [];
        this.chartAfter.update();

        document.getElementById('gini-before').textContent = '0.00';
        document.getElementById('gini-after').textContent = '0.00';
        document.getElementById('gini-change').textContent = 'Ingen ændring';
        document.getElementById('gini-change').className = 'gini-change';
    }
}
