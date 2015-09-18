["DcmR",["Ptet","TetR","DCM"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"{{alpha_{1}}}*{{dcmR}}*{{kd}}/(1+(TetR/{{beta_{TetR}}})**{{mju_{TetR}}})/({{kd}}+DCM)-{{d}}*DcmR"]
#all
["DcmR",["TetR","DCM"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"-{{d}}*DcmR"]
#no Ptet
["DcmR",["Ptet","DCM"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"{{alpha_{1}}}*{{dcmR}}*{{kd}}/({{kd}}+DCM)-{{d}}*DcmR"]
#no TetR
["DcmR",["Ptet","TetR","DCM"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"{{alpha_{1}}}*{{dcmR}}*{{kd}}/(1+(TetR/{{beta_{TetR}}})**{{mju_{TetR}}})/{{kd}}-{{d}}*DcmR"]
#no DCM
["DcmR",["DCM"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"-{{d}}*DcmR"]
#no Ptet,TetR
["DcmR",["TetR"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"-{{d}}*DcmR"]
#no Ptet,DCM
["DcmR",["Ptet"],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"-{{d}}*DcmR"]
#no TetR,DCM
["DcmR",[],[("alpha_{1}",3.83),("dcmR",150),("d",1.34),("kd",3.7),("mju_{TetR}",2),("beta_{TetR}",3.3)],"-{{d}}*DcmR"]
#no TetR,DCM,Ptet


["TetR",["ATC"],[("alpha_{3}",2.89),("tetR",150),("d",1.34),("mju_{ATC}",2),("beta_{ATC}",4.1)],"{{alpha_{3}}}*{{tetR}}/(1+(ATC/{{beta_{ATC}}})**{{mju_{ATC}}})-{{d}}*TetR"]
#all
["TetR",[],[("alpha_{3}",2.89),("tetR",150),("d",1.34),("mju_{ATC}",2),("beta_{ATC}",4.1)],"{{alpha_{3}}}*{{tetR}}-{{d}}*TetR"]
#no ATC

["sfGFP",["DcmR","PdcmA"],[("alpha_{2}",2.89),("sfgfp",150),("d",1.34),("mju_{DcmR}",2),("beta_{DcmR}",4.1)],"{{alpha_{2}}}*{{sfgfp}}/(1+(DcmR/{{beta_{DcmR}}})**{{mju_{DcmR}}})-{{d}}*sfGFP"]
#all
["sfGFP",["PdcmA"],[("alpha_{2}",2.89),("sfgfp",150),("d",1.34),("mju_{DcmR}",2),("beta_{DcmR}",4.1)],"{{alpha_{2}}}*{{sfgfp}}-{{d}}*sfGFP"]
#no DcmR
["sfGFP",["DcmR"],[("alpha_{2}",2.89),("sfgfp",150),("d",1.34),("mju_{DcmR}",2),("beta_{DcmR}",4.1)],"-{{d}}*sfGFP"]
#no PdcmA
