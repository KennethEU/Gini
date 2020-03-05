package com.kennetheu.gini;

public class Main {
    public static void main(String[] args) {
        int[] myDist = new int[] {40, 50, 60, 20, 30, 40, 30, 50, 40, 20};
        CreateData myIncomes = new CreateData(10,
                150_000,
                myDist);

        int[] myTaxSystem = new int[] {50_000,30,400_000,10,700_000,15};

        TaxPayers myTaxPayers = new TaxPayers(myIncomes, myTaxSystem);
        myTaxPayers.printInfo();

    }
}
