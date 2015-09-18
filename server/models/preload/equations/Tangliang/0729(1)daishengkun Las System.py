["LasR",["Promoter:BBa_J23119","A1i"],[("k",6.84),("d",4.3),("lasR",150)],"{{k}}*{{lasR}}*A1i-{{d}}*LasR"]
#all
["LasR",["A1i"],[("k",6.84),("d",4.3),("lasR",150)],"-{{d}}*LasR"]
#no Promoter:BBa_J23119
["LasR",["Promoter:BBa_J23119"],[("k",6.84),("d",4.3),("lasR",150)],"-{{d}}*LasR"]
#no A1i

["GFP",["Promoter:BBa_J23119","LasR"],[("k",7.22),("d",4.3),("gfp",150),("kd",4.8),("n",3)],"{{k}}*{{gfp}}*LasR**{{n}}/({{kd}}+LasR**{{n}})-{{d}}*GFP"]
#all
["GFP",["LasR"],[("k",7.22),("d",4.3),("gfp",150),("kd",4.8),("n",3)],"-{{d}}*GFP"]
#no Promoter:BBa_J23119
["GFP",["Promoter:BBa_J23119"],[("k",7.22),("d",4.3),("gfp",150),("kd",4.8),("n",3)],"-{{d}}*GFP"]
#no LasR