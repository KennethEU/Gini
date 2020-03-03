package com.kennetheu.gini;



public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {30, 50, 20, 20, 30, 40, 30, 40, 30, 20};
        CreateData income4 = new CreateData(10, 100000, fordeling);
        //CreateData income5 = new CreateData(new CreateIncomeDistribution(10, 100000, fordeling));
        income4.printIncomes();

    }
}
