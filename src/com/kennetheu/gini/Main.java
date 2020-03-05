package com.kennetheu.gini;

public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {40, 50, 60, 20, 30, 40, 30, 50, 40, 20};
        //CreateData income4 = new CreateData(10, 100000, fordeling);
        //CreateData income5 = new CreateData(new CreateIncomeDistribution(10, 100000, fordeling));
        CreateData myIncomes = new CreateData(1_000,
                50_000,
                2_000_000);
//        income6.printIncomes();
        int[] myTaxSystem = new int[] {50_000,25,300_000,10,600_000,15};

        TaxPayers myTaxPayers = new TaxPayers(myIncomes, myTaxSystem);
        myTaxPayers.printInfo();

    }
}
