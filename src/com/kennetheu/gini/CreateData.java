package com.kennetheu.gini;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.stream.DoubleStream;

public class CreateData {

    public int[] incomes;
    public double[] cumulativeIncomes;
    public double[] line45;
    public double giniCoef;

    public CreateData(int i) {
        incomes = getIncomeArray(i);
        cumulativeIncomes = getCumulativeIncomes(incomes);
        line45 = getLine45();
        giniCoef = getGiniCoef();
    }

    public int[] getIncomeArray(int incomes) {
        int incomeArray[] = new int[incomes];
        for (int i = 0; i < incomeArray.length; i++) {
            incomeArray[i] = getIncome(50_000,1_000_000);
        }
        // Sort the incomes
        Arrays.sort(incomeArray);
        return incomeArray;
    }

    public int getIncome(int min, int max) {
        return (int)(Math.random() * (max - min + 1) + min);
    }

    public double[] getCumulativeIncomes(int[] incomes) {
        double cumulativeArray[] = new double[incomes.length];
        double prevSum = 0;
        double sum = 0;
        for (int income : incomes) {
            sum += (double)income;
        }
        for ( int i = 0 ; i < incomes.length ; i++ )
        {
            cumulativeArray[i] = (prevSum + incomes[i]) / sum;
            prevSum += incomes[i];
        }
        return cumulativeArray;
    }

    public double[] getLine45() {
        double line45[] = new double[incomes.length];
        for (int i = 0; i < incomes.length; i++) {
            line45[i] = (i+1) / (double)incomes.length;
        }
        return line45;
    }

    public double getGiniCoef() {
        double a[] = new double[incomes.length];

        for (int i = 0; i < incomes.length; i++) {
            a[i] = line45[i] - cumulativeIncomes[i];
        }
        double giniCoef = DoubleStream.of(a).sum() / (DoubleStream.of(cumulativeIncomes).sum() + DoubleStream.of(a).sum());
        return giniCoef;
    }

    public void printIncomes() {
        DecimalFormat df=new DecimalFormat("0.000");
        for (int i = 0; i < this.incomes.length; i++ ) {
            System.out.println(i+1 + "\t" + this.incomes[i] + "\tCum: " + df.format(this.cumulativeIncomes[i]) + "\tLine45: " + this.line45[i]);
        }
        System.out.println("Ginicoef: " + df.format(giniCoef));
    }
}
