package com.kennetheu.gini;

public class TaxPayer {
    public int income;
    public int incomeAfterTax;
    public int totalTax;
    public int[] bracketsAndPercentages;

    public TaxPayer(int taxPayerIncome, int[] bracketsAndPercentages) {
        this.income = taxPayerIncome;
        this.bracketsAndPercentages = bracketsAndPercentages;
        totalTax = 0;
        int bracketsRun = 0;
        for (int i = 0; i < bracketsAndPercentages.length; i+=2) {
            if ((income - bracketsRun) - bracketsAndPercentages[i] > 0) {
                bracketsRun += bracketsAndPercentages[i];
                totalTax += taxIncome(income - bracketsRun, bracketsAndPercentages[i+1]);
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