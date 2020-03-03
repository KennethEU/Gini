package com.kennetheu.gini;

import org.jetbrains.annotations.NotNull;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.stream.DoubleStream;

public class CreateData {

    private int[] incomes;
    private double[] cumulativeIncomes;
    private double[] line45;
    private double giniCoef;
    private int sumOfIndividuals;

    public int getSumOfIndividuals() {
        return sumOfIndividuals;
    }

    public int[] getIncomes() {
        return incomes;
    }

    public double[] getCumulativeIncomes() {
        return cumulativeIncomes;
    }

    public double[] getLine45() {
        return line45;
    }

    public double getGiniCoef() {
        return giniCoef;
    }

    public CreateData(@NotNull CreateIncomeDistribution createIncomeDistribution) {
        this.incomes = createIncomeDistribution.getIncomeDistribution();
        this.cumulativeIncomes = getCumulativeIncomes(incomes);
        this.line45 = makeLine45();
        this.giniCoef = calcGiniCoef();
        this.sumOfIndividuals = createIncomeDistribution.getSumOfIndividuals();
    }

    public CreateData(int[] incomes) {
        this.incomes = incomes;
        this.cumulativeIncomes = getCumulativeIncomes(incomes);
        this.line45 = makeLine45();
        this.giniCoef = calcGiniCoef();
    }

    public CreateData(int i) {
        this.incomes = getIncomeArray(i);
        this.cumulativeIncomes = getCumulativeIncomes(incomes);
        this.line45 = makeLine45();
        this.giniCoef = calcGiniCoef();
    }

    public int[] getIncomeArray(int incomes) {
        int incomeArray[] = new int[incomes];
        for (int i = 0; i < incomeArray.length; i++) {
            incomeArray[i] = makeIncome(50_000,1_000_000);
        }
        // Sort the incomes
        Arrays.sort(incomeArray);
        return incomeArray;
    }

    public int makeIncome(int min, int max) {
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

    public double[] makeLine45() {
        double line45[] = new double[incomes.length];
        for (int i = 0; i < incomes.length; i++) {
            line45[i] = (i+1) / (double)incomes.length;
        }
        return line45;
    }

    public double calcGiniCoef() {
        double a[] = new double[incomes.length];

        for (int i = 0; i < incomes.length; i++) {
            a[i] = line45[i] - cumulativeIncomes[i];
        }
        double giniCoef = DoubleStream.of(a).sum() / (DoubleStream.of(cumulativeIncomes).sum() + DoubleStream.of(a).sum());
        return giniCoef;
    }

    public void printIncomes() {
        DecimalFormat df=new DecimalFormat("0.000");
        int printEvery = sumOfIndividuals / 9;
        int i = 0;
        while (i < this.incomes.length) {
            System.out.println(i+1 + "\tInc: " + this.incomes[i] + "\tCum: " + df.format(this.cumulativeIncomes[i]) + "\tLine45: " + df.format(this.line45[i]));
            i = i+printEvery;
        }
        if (i-printEvery != sumOfIndividuals-1) {
            System.out.println(sumOfIndividuals + "\tInc: " + this.incomes[sumOfIndividuals-1] + "\tCum: " + df.format(this.cumulativeIncomes[sumOfIndividuals-1]) + "\tLine45: " + df.format(this.line45[sumOfIndividuals-1]));
        }
        System.out.println("There is " + sumOfIndividuals + " in the data and the ginicoef is " + df.format(giniCoef));
    }
}
