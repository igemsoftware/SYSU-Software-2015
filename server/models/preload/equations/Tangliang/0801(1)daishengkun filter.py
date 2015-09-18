["LuxI",["AHL","CI"],[("alpha_{LuxI}",4.82),("gamma_{LuxI}",1.62),("luxI",150),("n_{CI}",1),("beta_{CI}",3)],"{{alpha_{LuxI}}}*{{luxI}}*AHL/(1+(CI/{{beta_{CI}}})**{{n_{CI}}})-{{gamma_{LuxI}}}*LuxI"]
#all
["LuxI",["CI"],[("alpha_{LuxI}",4.82),("gamma_{LuxI}",1.62),("luxI",150),("n_{CI}",1),("beta_{CI}",3)],"-{{gamma_{LuxI}}}*LuxI"]
#no AHL
["LuxI",["AHL"],[("alpha_{LuxI}",4.82),("gamma_{LuxI}",1.62),("luxI",150),("n_{CI}",1),("beta_{CI}",3)],"-{{gamma_{LuxI}}}*LuxI"]
#no CI
["LuxI",[],[("alpha_{LuxI}",4.82),("gamma_{LuxI}",1.62),("luxI",150),("n_{CI}",1),("beta_{CI}",3)],"-{{gamma_{LuxI}}}*LuxI"]
#no AHL,CI

["LuxR",["AHL"],[("alpha_{LuxR}",3.63),("luxR",150),("gamma_{LuxR}",0.62)],"{{alpha_{LuxR}}}*AHL-{{gamma_{LuxR}}}*LuxR"]
#all
["LuxR",[],[("alpha_{LuxR}",3.63),("luxR",150),("gamma_{LuxR}",0.62)],"-{{gamma_{LuxR}}}*LuxR"]
#no AHL

["RFP",["LuxR","PluxR"],[("alpha_{RFP}",4.27),("gamma_{RFP}",1.14),("rfp",150),("kd",4.87),("n",2)],"{{alpha_{RFP}}}*{{rfp}}*LuxR**{{n}}/({{kd}}+LuxR**{{n}})-{{gamma_{RFP}}}*RFP"]
#all
["RFP",["LuxR"],[("alpha_{RFP}",4.27),("gamma_{RFP}",1.14),("rfp",150),("kd",4.87),("n",2)],"{{alpha_{RFP}}}*{{rfp}}*LuxR**{{n}}-{{gamma_{RFP}}}*RFP"]
#no PluxR
["RFP",["PluxR"],[("alpha_{RFP}",4.27),("gamma_{RFP}",1.14),("rfp",150),("kd",4.87),("n",2)],"-{{gamma_{RFP}}}*RFP"]
#no LuxR
["RFP",[],[("alpha_{RFP}",4.27),("gamma_{RFP}",1.14),("rfp",150),("kd",4.87),("n",2)],"-{{gamma_{RFP}}}*RFP"]
#no PluxR,LuxR