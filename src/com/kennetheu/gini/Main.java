package com.kennetheu.gini;



public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {30, 30, 20, 20, 30, 40, 30, 40, 20, 20};
        //CreateIncomeDistribution income4 = new CreateIncomeDistribution(10, 100000, fordeling);
        CreateData income5 = new CreateData(new CreateIncomeDistribution(10, 100000, fordeling));
        income5.printIncomes();

    }
}
