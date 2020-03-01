package com.kennetheu.gini;

import java.text.DecimalFormat;

public class Main {

    public static void main(String[] args) {
        CreateData income2 = new CreateData(1000);
        System.out.println("Printing");
        income2.printIncomes();
        DecimalFormat df=new DecimalFormat("0.000");
        for (int i = 0; i < 10; i++) {
            CreateData income = new CreateData(5_000_000);
            System.out.println(df.format(income.giniCoef));
        }
    }
}
