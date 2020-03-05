package com.kennetheu.gini;

import java.util.ArrayList;

public class TaxPayers {
    ArrayList<TaxPayer> TaxPayers = new ArrayList<TaxPayer>();
    double giniBeforeTax;
    double giniAfterTax;

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
        System.out.println(giniBeforeTax);
        System.out.println(giniAfterTax);
    }

}
