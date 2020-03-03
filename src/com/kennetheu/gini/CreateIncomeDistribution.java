package com.kennetheu.gini;

import java.util.stream.DoubleStream;
import java.util.stream.IntStream;

public class CreateIncomeDistribution {
    private int groups; // fx 10 (deciler)
    private int groupSpan; // indkomstspredningen for gruppen fx 100.000
    private int[] groupSizes; // antal individer i hver gruppe
    private int[] incomeDistribution;

    public int[] getIncomeDistribution() {
        return incomeDistribution;
    }

    public int getGroups() {
        return groups;
    }

    public void setGroups(int groups) {
        this.groups = groups;
    }

    public int getGroupSpan() {
        return groupSpan;
    }

    public void setGroupSpan(int groupSpan) {
        this.groupSpan = groupSpan;
    }

    public int[] getGroupSizes() {
        return groupSizes;
    }

    public void setGroupSizes(int[] groupSizes) {
        this.groupSizes = groupSizes;
    }

    public CreateIncomeDistribution(int groups, int groupSpan, int[] groupSizes) {
        this.groups = groups;
        this.groupSpan = groupSpan;
        this.groupSizes = groupSizes;
        this.incomeDistribution = makeIncomeDistribution();
    }

    private int[] makeIncomeDistribution() {

        int sumOfIndividuals = IntStream.of(groupSizes).sum();
        int [] incomeDistribution = new int[sumOfIndividuals];
        int index = 0;
        for (int i = 0; i < groups; i++) {
            int min = i * groupSpan;
            int max = (i * groupSpan) + groupSpan;
            for (int j = 1; j <= groupSizes[i]; j++) {
                incomeDistribution[index] = (int)(Math.random() * (max - min + 1) + min);
                System.out.println(incomeDistribution[index]);
                index++;
            }
        }
        return incomeDistribution;
    }
}
