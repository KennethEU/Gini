package com.kennetheu.gini;

import java.util.stream.DoubleStream;

public class CalcGini {

    public static double getGini(int[] incomes) {
        double[] cumulativeIncomes = getCumulativeIncomes(incomes);
        double[] line45 = makeLine45(incomes);
        double giniCoef = calcGiniCoef(incomes, cumulativeIncomes, line45);
        return giniCoef;
    }

    public static double[] getCumulativeIncomes(int[] incomes) {
        double[] cumulativeArray = new double[incomes.length];
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

    public static double[] makeLine45(int[] incomes) {
        double[] line45 = new double[incomes.length];
        for (int i = 0; i < incomes.length; i++) {
            line45[i] = (i+1) / (double)incomes.length;
        }
        return line45;
    }

    public static double calcGiniCoef(int[] incomes, double[] cumulativeIncomes, double[] line45) {
        double[] a = new double[incomes.length];

        for (int i = 0; i < incomes.length; i++) {
            a[i] = line45[i] - cumulativeIncomes[i];
        }
        return DoubleStream.of(a).sum() / (DoubleStream.of(cumulativeIncomes).sum() + DoubleStream.of(a).sum());
    }
}
