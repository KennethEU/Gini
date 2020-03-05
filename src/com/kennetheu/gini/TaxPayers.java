package com.kennetheu.gini;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class TaxPayers {
    ArrayList<TaxPayer> TaxPayers = new ArrayList<TaxPayer>();
    double giniBeforeTax;
    double giniAfterTax;
    DecimalFormat df=new DecimalFormat("0.000");

    public TaxPayers(CreateData incomes, int[]bracketsAndPercentage) {
        for (int income : incomes.getIncomes()) {
            TaxPayers.add(new TaxPayer(income, bracketsAndPercentage));
        }
        calcGini();
    }

    public void calcGini() {
        int[] beforeArray = TaxPayers.stream().mapToInt(taxPayer -> taxPayer.income).toArray();
        int[] afterArray = TaxPayers.stream().mapToInt(taxPayer -> taxPayer.incomeAfterTax).toArray();
        giniBeforeTax = CalcGini.getGini(beforeArray);
        giniAfterTax = CalcGini.getGini(afterArray);
    }

    public void printInfo() {
        TaxPayers.forEach(taxPayer -> {
            System.out.println(
                    "Income: " + taxPayer.income +
                    " After tax: " + taxPayer.incomeAfterTax +
                    " Total tax: " + taxPayer.totalTax);
        });
        System.out.println("Gini before tax: " + df.format(giniBeforeTax));
        System.out.println("Gini after tax: " + df.format(giniAfterTax));
    }

}
