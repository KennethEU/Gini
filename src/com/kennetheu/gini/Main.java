package com.kennetheu.gini;


import java.util.ArrayList;

public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {40, 50, 60, 20, 30, 40, 30, 50, 40, 20};
        //CreateData income4 = new CreateData(10, 100000, fordeling);
        //CreateData income5 = new CreateData(new CreateIncomeDistribution(10, 100000, fordeling));
        CreateData income6 = new CreateData(20,
                50000,
                2000000);
        income6.printIncomes();
        int[] myBrackets = new int[] {50000,25,300000,10,600000,15};

//        ArrayList<TaxPayer> myTaxPayers = new ArrayList<TaxPayer>();
//        for (int income : income6.getIncomes()) {
//            myTaxPayers.add(new TaxPayer(income, myBrackets));
//        }

        TaxPayers myTaxPayers = new TaxPayers(income6, myBrackets);

        myTaxPayers.TaxPayers.forEach(taxPayer -> {
            System.out.println(
                    "Income: " + taxPayer.income +
                    " After tax: " + taxPayer.incomeAfterTax +
                    " Total tax: " + taxPayer.totalTax);
        });

    }
}
