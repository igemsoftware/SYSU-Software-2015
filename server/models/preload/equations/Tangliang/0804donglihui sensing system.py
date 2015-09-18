["OHHL",["oHHL"],[("beta_{p}",5.87),("eta_{0}",0.83)],"{{beta_{p}}}-{{eta_{0}}}*oHHL"]
#all
["OHHL",[],[("beta_{p}",5.87),("eta_{0}",0.83)],"{{beta_{p}}}"]
#no oHHL

["YenR",["Promoter:BBa_J23100","yenR","OHHL"],[("alpha_{YenR}",4.66),("n_{OHHL}",2),("beta_{OHHL}",2.5),("d",0.742),("yenR",150)],"{{alpha_{YenR}}}*{{yenR}}/(1+(OHHL/{{beta_{OHHL}}})**{{n_{OHHL}}})-{{d}}*YenR"]
#all
["YenR",["yenR","OHHL"],[("alpha_{YenR}",4.66),("n_{OHHL}",2),("beta_{OHHL}",2.5),("d",0.742),("yenR",150)],"-{{d}}*YenR"]
#no Promoter:BBa_J23100
["YenR",["Promoter:BBa_J23100","OHHL"],[("alpha_{YenR}",4.66),("n_{OHHL}",2),("beta_{OHHL}",2.5),("d",0.742),("yenR",150)],"-{{d}}*YenR"]
#no yenR
["YenR",["Promoter:BBa_J23100","yenR"],[("alpha_{YenR}",4.66),("n_{OHHL}",2),("beta_{OHHL}",2.5),("d",0.742),("yenR",150)],"{{alpha_{YenR}}}*{{yenR}}-{{d}}*YenR"]
#no OHHL