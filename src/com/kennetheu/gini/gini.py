import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

class Gini:
    def __init__(self, incdata):
        self.dist = pd.read_csv(incdata, sep=";", header=0)
        print('Indlæste indkomstfordeling:\n----------\n' + str(self.dist))
        mininc = list(self.dist.iloc[:,0])
        maxinc = list(self.dist.iloc[:,1])
        sizeinc = list(self.dist.iloc[:,2])
        inc_temp = []
        for index, x in enumerate(mininc):
            inc_temp.extend(np.random.randint(low = mininc[index], high = maxinc[index], size = sizeinc[index]))
        # Sort the list and make an array
        self.inc_sorted = np.sort(np.array(inc_temp))
        self.inccum = self.inc_cum(self.inc_sorted)
        print('\nBeregnet kumulative procenter, kan findes under .inccum')
        self.line_45()
        self.ginicoef = self.coef(self.line45, self.inccum)
        print('Ginikoefficenten er beregnet til '+ str(self.ginicoef) + ', kan findes under .ginicoef')

    @staticmethod
    def inc_cum(incdist):
        """ Return af array of the cumulative procentage of a list of numbers (incomes) """
        # Make a variable to store the procentage of the persons income of the total income
        inc_dist = []
        # Calculate the procentage for every income and ad it to inc_dist - which ofcource is still sorted
        for inc in incdist :
            inc_dist.append(inc / sum(incdist))
        # Return the array with the cumulative procentage using the function cumsum()
        return np.cumsum(inc_dist)

    def line_45(self):
        """ Return af array of the even distribution of the procentage """
        line45 = []
        count = 0
        for x in self.inc_sorted :
            count += 1
            line45.append(count / len(self.inc_sorted))
        self.line45 = np.array(line45)
        print('Beregnet 45-graders linjen, kan findes under .line45')

    @staticmethod
    def coef(l45, inccum):
        """ Return Gini """
        a = l45 - inccum
        ginicoef = sum(a) / (sum(inccum) - 1 + sum(a))
        return ginicoef

    def print_info(self):
        print(' -- PRINTER INFO -- ')
        print('Indlæste indkomstfordeling:\n----------\n' + str(self.dist))
        print('\nGinikoefficenten er beregnet til '+ str(self.ginicoef) + ', kan findes under .ginicoef')

    def tax(self, after_tax=True):
        """ Is taxing the incomes, use after_tax=False to get the tax value """
        low_tax = 0.1
        middel_tax = 0.3
        top_tax = 0.15
        no_tax_backet = 50000
        low_tax_backet = 200000
        middel_tax_backet = 500000
        tax = []
        for x in self.inc_sorted :
            if x < no_tax_backet:
                tot_tax = x * 0
                tax.append(tot_tax)
                #print('Notax income: ' + str(x) + '  -* Totaltax ' + str(round(tot_tax)) + '  -* Percentage ' + str(round((tot_tax/x),3)))
            elif x >= no_tax_backet and x <= low_tax_backet:
                low = (x - no_tax_backet) * low_tax
                tot_tax = low
                tax.append(tot_tax)
                #print('Lowtax income: ' + str(x) + ' Low: ' + str(round(low)) + '  -* Totaltax ' + str(round(tot_tax)) + '  -* Percentage ' + str(round((tot_tax/x),3)))
            elif x > low_tax_backet and x <= middel_tax_backet:
                low = (x - no_tax_backet) * low_tax
                mid = (x - low_tax_backet) * middel_tax
                tot_tax = low + mid
                tax.append(tot_tax)
                #print('Middeltax income: ' + str(x) + ' Low: ' + str(round(low)) + ' Middel: ' + str(round(mid)) + '  -* Totaltax ' + str(round(tot_tax)) + '  -* Percentage ' + str(round((tot_tax/x),3)))
            elif x > middel_tax_backet:
                low = (x - no_tax_backet) * low_tax
                mid = (x - low_tax_backet) * middel_tax
                top = (x - middel_tax_backet) * top_tax
                tot_tax = low + mid + top
                tax.append(tot_tax)
                #print('Toptax income: ' + str(x) + ' Low: ' + str(round(low)) + ' Middel: ' + str(round(mid))+ ' Top: ' + str(round(top)) + '  -* Totaltax ' + str(round(tot_tax)) + '  -* Percentage ' + str(round((tot_tax/x),3)))
        if after_tax is True:
            return np.array(self.inc_sorted - tax)
        else:
            return np.array(tax)

    def plot(self, tax_it=False):
        """ Draws plots """
        # Clear the plot if it was run before
        plt.clf()
        # plt.xkcd()
        # Draw the 45-degree line and the income distribution
        plt.plot(self.line45, self.line45, c='k', label = 'Lige fordeling')
        plt.plot(self.line45, self.inccum, label = 'Lorenz før skat')
        # Check if the income distribution should be taxed, and draw the line after tax
        if tax_it is True:
            print('Tegner plot med skat')
            after_tax_inccum = self.inc_cum(self.tax(after_tax=True))
            tax_sum = int(sum(self.tax(after_tax=False)))
            plt.plot(self.line45, after_tax_inccum, label = 'Lorenz efter skat')
            plt.suptitle('Lorenz-kurven for indkomstfordelingen før og efter skat', fontsize=12, ha='center')
            after_tax_gini = self.coef(self.line45, after_tax_inccum)
            print("Gini-koefficenten for indkomstfordelingen er " + str(round(self.ginicoef, 3)) + " og " + str(round(after_tax_gini, 3)) + " efter skat. \nSkatten har procentuelt ændret uligheden med " + str(round(((after_tax_gini - self.ginicoef)/self.ginicoef), 3)))
            print("Der blev hentet " + str(tax_sum) + " i skat, svarende til " + str(round(tax_sum / sum(self.inc_sorted) * 100, 1)) + "% af den samlede indkomst på " + str(sum(self.inc_sorted)))
        else:
            print('Tegner plot')
            plt.suptitle('Lorenz-kurven for indkomstfordelingen', fontsize=12, ha='center')
            print("Gini-koefficenten for indkomstfordelingen er " + str(round(self.ginicoef, 3)))
        plt.legend()
        plt.grid(True, which='both')
        plt.savefig('Gini_plot.pdf')
        plt.show()
