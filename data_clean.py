# coding: utf-8
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import bokeh as bk
import os
import json
import csv

cwd = os.getcwd()
#print(cwd)

multiarr = [[]]
pre = "Afghanistan"
i=0
tmp = []
country=[]
comp = []

os.chdir('D:\WPI\DataVisul\Final_Pro')
#ig=pd.read_csv("WB_Migration-60-00.csv")
year = 6;
with open('D:\WPI\DataVisul\Final_Pro\WB_Migration-60-00.csv', 'r') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for row in spamreader:
        if str(row[0]) == "" or str(row[0]) == None:
            country.append(pre)
            multiarr.append(tmp)
            break
        if str(row[0]) == "Country Origin Name":
            continue
        if row[year] == '':
            row[year] = 0
        if pre != str(row[0]):
            if i==0:
                multiarr[0] = tmp
            else:
                multiarr.append(tmp)
            country.append(pre)
            pre = str(row[0])
            i+=1
            tmp = []
        tmp.append(int(row[year]))
        if i==0: comp.append(row[5])

X = np.array(multiarr)
t = []
total = []
net = []
inflo = []
outflo = []

outf = np.sum(X,axis=1)
inf = np.sum(X,axis=0)
for i in range(len(outf)):
    sum_o = np.sum(outf[i])
    sum_i = np.sum(inf[i])
    net.append(sum_i - sum_o)
    total.append(sum_i + sum_o)
    inflo.append(sum_i)
    outflo.append(sum_o)
    if total[i] <= 2000000: t.append(i)

Y = np.delete(X,t,0)
Z = np.delete(Y,t,1)

for index in sorted(t, reverse=True):
    del country[index]
    del total[index]
    del net[index]
    del inflo[index]
    del outflo[index]

color_arr = [
"#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896",
"#9467bd","#c5b0d5","#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a",
"#d62728","#ff9896","#9467bd","#c5b0d5"
]

#year -= 10
cut = 0
with open('data\matrix_'+str(year)+'0'+'.json', 'w') as f:
        json.dump(Z.tolist(), f)
with open('D:\WPI\DataVisul\Final_Pro\data\country_'+str(year)+'0'+'.csv', 'w') as csvfile:
    #writer = csv.writer(csvfile, delimiter=',')
    csvfile.write("name"+","+"color"+","+"Inflow"+","+"Outflow"+","+"Netflow"+"\n")
    #writer.writerow(("name", "color"))
    for i in range(len(country)):
        cut = cut%20
        csvfile.write(country[i]+","+color_arr[cut]+","+str(inflo[i])+","+str(outflo[i])+","+str(net[i])+"\n")
        cut += 1

#print(multiarr[231])
