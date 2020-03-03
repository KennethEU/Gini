package com.kennetheu.gini;

import java.text.DecimalFormat;

public class Main {

    public static void main(String[] args) {

        int[] fordeling = new int[] {10, 20, 20, 20, 30, 30, 30, 30, 10, 10};
        CreateData income5 = new CreateData(new CreateIncomeDistribution(10, 10000, fordeling));
        income5.printIncomes();
//        DecimalFormat df=new DecimalFormat("0.000");
//        for (int i = 0; i < 1; i++) {
//            CreateData income = new CreateData(1000);
//            System.out.println(df.format(income.getGiniCoef()));
//        }
    }
}
