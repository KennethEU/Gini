package com.kennetheu.gini;

public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {40, 50, 60, 20, 30, 40, 30, 50, 40, 20};

        CreateData myIncomes = new CreateData(1_000,
                50_000,
                2_000_000);

        int[] myTaxSystem = new int[] {50_000,25,300_000,10,600_000,15};

        TaxPayers myTaxPayers = new TaxPayers(myIncomes, myTaxSystem);
        myTaxPayers.printInfo();

    }
}
