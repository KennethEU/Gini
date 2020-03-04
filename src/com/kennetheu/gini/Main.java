package com.kennetheu.gini;



public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {40, 50, 60, 20, 30, 40, 30, 50, 40, 20};
        //CreateData income4 = new CreateData(10, 100000, fordeling);
        //CreateData income5 = new CreateData(new CreateIncomeDistribution(10, 100000, fordeling));
        CreateData income6 = new CreateData(500,
                50000,
                2000000);
        income6.printIncomes();

    }
}
