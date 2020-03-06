package com.kennetheu.gini;

public class TaxPayer {
    private int income;
    private int incomeAfterTax;
    private int totalTax;

    public int getIncome() {
        return income;
    }

    public int getIncomeAfterTax() {
        return incomeAfterTax;
    }

    public int getTotalTax() {
        return totalTax;
    }

    public TaxPayer(int taxPayerIncome, int[] bracketsAndPercentages) {
        this.income = taxPayerIncome;
        totalTax = 0;
        int bracketsRun = 0;
        for (int i = 0; i < bracketsAndPercentages.length; i+=2) {
            if (income - bracketsAndPercentages[i] > 0) {
                bracketsRun += bracketsAndPercentages[i];
                totalTax += taxIncome(income - bracketsAndPercentages[i], bracketsAndPercentages[i+1]);
            }
            else {
                break;
            }
        }
        incomeAfterTax = income - totalTax;
    }

    private int taxIncome(int amount, int percentages) {
        double taxPercentage = (double)percentages / 100;
        return (int) (amount * taxPercentage);

    }
}