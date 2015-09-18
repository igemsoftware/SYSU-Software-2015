["TetR",["Pconst","ALCR"],[("alpha_{TetR}",3.55),("gamma_{TetR}",1.52),("tetR",150),("n_{ALCR}",2),("beta_{ALCR}",4)],"{{alpha_{TetR}}}*{{tetR}}/(1+(ALCR/{{beta_{ALCR}}})**{{n_{ALCR}}})-{{gamma_{TetR}}}*TetR"]
#all
["TetR",["ALCR"],[("alpha_{TetR}",3.55),("gamma_{TetR}",1.52),("tetR",150),("n_{ALCR}",2),("beta_{ALCR}",4)],"-{{gamma_{TetR}}}*TetR"]
#no Pconst
["TetR",["Pconst"],[("alpha_{TetR}",3.55),("gamma_{TetR}",1.52),("tetR",150),("n_{ALCR}",2),("beta_{ALCR}",4)],"{{alpha_{TetR}}}*{{tetR}}-{{gamma_{TetR}}}*TetR"]
#no ALCR
["TetR",[],[("alpha_{TetR}",3.55),("gamma_{TetR}",1.52),("tetR",150),("n_{ALCR}",2),("beta_{ALCR}",4)],"{{alpha_{TetR}}}*{{tetR}}-{{gamma_{TetR}}}*TetR"]
#no Pconst,ALCR

["LacIm1",["PtetR","TetR"],[("alpha_{LacIm1}",3.55),("gamma_{LacIm1}",1.52),("LacIm1",150),("n_{TetR}",2),("beta_{TetR}",4)],"{{alpha_{LacIm1}}}*{{LacIm1}}/(1+(TetR/{{beta_{TetR}}})**{{n_{TetR}}})-{{gamma_{LacIm1}}}*LacIm1"]
#all
["LacIm1",["TetR"],[("alpha_{LacIm1}",3.55),("gamma_{LacIm1}",1.52),("LacIm1",150),("n_{TetR}",2),("beta_{TetR}",4)],"-{{gamma_{LacIm1}}}*LacIm1"]
#no PtetR
["LacIm1",["PtetR"],[("alpha_{LacIm1}",3.55),("gamma_{LacIm1}",1.52),("LacIm1",150),("n_{TetR}",2),("beta_{TetR}",4)],"-{{gamma_{LacIm1}}}*LacIm1"]
#no TetR
["LacIm1",[],[("alpha_{LacIm1}",3.55),("gamma_{LacIm1}",1.52),("LacIm1",150),("n_{TetR}",2),("beta_{TetR}",4)],"-{{gamma_{LacIm1}}}*LacIm1"]
#no PtetR,TetR

["CI",["PcI","TetR"],[("alpha_{CI}",3.55),("gamma_{CI}",1.52),("cI",150),("n_{TetR}",2),("beta_{TetR}",4)],"{{alpha_{CI}}}*{{cI}}/(1+(TetR/{{beta_{TetR}}})**{{n_{TetR}}})-{{gamma_{CI}}}*CI"]
#all
["CI",["TetR"],[("alpha_{CI}",3.55),("gamma_{CI}",1.52),("cI",150),("n_{TetR}",2),("beta_{TetR}",4)],"-{{gamma_{CI}}}*CI"]
#no PcI
["CI",["PcI"],[("alpha_{CI}",3.55),("gamma_{CI}",1.52),("cI",150),("n_{TetR}",2),("beta_{TetR}",4)],"-{{gamma_{CI}}}*CI"]
#no TetR
["CI",[],[("alpha_{CI}",3.55),("gamma_{CI}",1.52),("cI",150),("n_{TetR}",2),("beta_{TetR}",4)],"-{{gamma_{CI}}}*CI"]
#no PcI,TetR

["LacI",["PcI","CI"],[("alpha_{LacI}",3.55),("gamma_{LacI}",1.52),("lacI",150),("n_{CI}",2),("beta_{CI}",4)],"{{alpha_{LacI}}}*{{lacI}}/(1+(CI/{{beta_{CI}}})**{{n_{CI}}})-{{gamma_{LacI}}}*LacI"]
#all
["LacI",["CI"],[("alpha_{LacI}",3.55),("gamma_{LacI}",1.52),("lacI",150),("n_{CI}",2),("beta_{CI}",4)],"-{{gamma_{LacI}}}*LacI"]
#no PcI
["LacI",["PcI"],[("alpha_{LacI}",3.55),("gamma_{LacI}",1.52),("lacI",150),("n_{CI}",2),("beta_{CI}",4)],"-{{gamma_{LacI}}}*LacI"]
#no CI
["LacI",[],[("alpha_{LacI}",3.55),("gamma_{LacI}",1.52),("lacI",150),("n_{CI}",2),("beta_{CI}",4)],"-{{gamma_{LacI}}}*LacI"]
#no PcI,CI
