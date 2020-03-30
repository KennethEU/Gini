package com.kennetheu.gini;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
//        int[] myDist = new int[]{40, 50, 60, 20, 30, 40, 30, 50, 40, 20};
//        CreateData myIncomes = new CreateData(10,
//                150_000,
//                myDist);
//
//        int[] myTaxSystem = new int[]{50_000, 30, 400_000, 20, 700_000, 15};
//
//        TaxPayers myTaxPayers = new TaxPayers(myIncomes, myTaxSystem);
//        myTaxPayers.printInfo();

        char choice;
        Scanner keyboard = new Scanner(System.in);
        System.out.println("Velkommen til Kenneths Gini-program!");
        System.out.println("------------------------------------");
        CreateData myIncomes = null;
        TaxPayers myTaxPayers = null;
        // Create a menu
        do {
            System.out.println();
            System.out.println("Du har nu følgende valgmuligheder:");
            System.out.println("[1] Lav en indkomstfordeling");
            System.out.println("[2] Print Gini for indkomstfordeling (før skat)");
            System.out.println("[3] Lav et skattesystem og beskat din indkomst fordeling");
            System.out.println("[4] Print Gini for indkomstfordeling (efter skat)");

            System.out.println();
            System.out.println("[9] Luk programmet");
            System.out.print("Dit valg: ");

            choice = keyboard.next().charAt(0);
            System.out.println();

            switch (choice) {
                case '1':
                    myIncomes = makeIncome();
                    break;
                case '2':
                    if (myIncomes != null) {
                        System.out.println("Gini-koefficent for indkomstfordelingen: " + myIncomes.getGiniCoef());
                        System.out.println();
                    } else {
                        System.out.println("--- FEJL: Du har ikke lavet en indkomstfordeling endnu ---");
                        System.out.println();
                    }
                    break;
                case '3':
                    if (myIncomes != null) {
                        // lav skattesystem her!!
                        System.out.println();
                        System.out.println("Du har nu følgende muligheder");
                        System.out.println("[1] Brug standard skattesystem");
                        System.out.println("[2] Lav dit eget falde skattesystem");
                        System.out.println("[3] Lav dit eget progressive skattesystem");
                        System.out.println("[4] Gå tilbage");
                        System.out.print("Dit valg: ");
                        choice = keyboard.next().charAt(0);
                        switch (choice) {
                            case '1':
                                int[] myTaxSystem = new int[]{50_000, 30, 400_000, 20, 700_000, 15};
                                myTaxPayers = new TaxPayers(myIncomes, myTaxSystem);
                                myTaxPayers.printInfo();
                                break;
                            case '4':
                                break;
                        }
                    } else {
                        System.out.println("--- FEJL: Du har ikke lavet en indkomstfordeling endnu ---");
                    }
                    break;
                case '4':
                    if (myTaxPayers != null) {
                        System.out.println("Gini-koefficent for indkomstfordelingen efter skat: " + myTaxPayers.getGiniAfterTax());
                    } else {
                        System.out.println("--- FEJL: Du har ikke beskattet din indkomstfordeling endnu ---");
                    }
                    break;
                case '9':
                    break;
                default:
                    System.out.println("--- FEJL: Valg ikke gyldigt ---");
            }

        } while (choice != '9');
        System.out.println("Tak for denne gang!");
    }
    public static CreateData makeIncome() {
        Scanner keyboard = new Scanner(System.in);
        System.out.print("Hvor mange enheder skal fordelingen inddeles i? ");
        int size = keyboard.nextInt();
        int[] myDist = new int[size];
        System.out.println("Du skal nu udfylde antal personer i hver inddeling:");
        for (int i = 0; i < myDist.length; i++) {
            System.out.print(i+1 + ": ");
            myDist[i] = keyboard.nextInt();

        }
        System.out.print("Hvor stor spredning dækker hver inddeling over? ");
        int span = keyboard.nextInt();
        CreateData myIncomes = new CreateData(myDist.length, span, myDist);
        System.out.println();
        return myIncomes;
    }

}