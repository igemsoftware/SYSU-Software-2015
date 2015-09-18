["RhlR",["Promoter:BBa_J23119","A2i"],[("k",6.24),("d",4.3),("rhlR",150)],"{{k}}*{{rhlR}}*A2i-{{d}}*RhlR"]
#all
["RhlR",["A2i"],[("k",6.24),("d",4.3),("rhlR",150)],"-{{d}}*RhlR"]
#no Promoter:BBa_J23119
["RhlR",["Promoter:BBa_J23119"],[("k",6.24),("d",4.3),("rhlR",150)],"-{{d}}*RhlR"]
#no A1i

["GFP",["Promoter:BBa_J23119","RhlR"],[("k",7.22),("d",4.3),("gfp",150),("kd",4.8),("n",3)],"{{k}}*{{gfp}}*RhlR**{{n}}/({{kd}}+RhlR**{{n}})-{{d}}*GFP"]
#all
["GFP",["RhlR"],[("k",7.22),("d",4.3),("gfp",150),("kd",4.8),("n",3)],"-{{d}}*GFP"]
#no Promoter:BBa_J23119
["GFP",["Promoter:BBa_J23119"],[("k",7.22),("d",4.3),("gfp",150),("kd",4.8),("n",3)],"-{{d}}*GFP"]
#no RhlR