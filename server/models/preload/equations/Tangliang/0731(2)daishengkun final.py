["luxI-LVA",["Plac","AHL","LuxI-LVA","IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"{{k}}*{{luxI}}*IPTG**{{n}}/(IPTG**{{n}}+{{kd}})-{{d}}*LuxI-LVA"]
#all
["luxI-LVA",["AHL","LuxI-LVA","IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"-{{d}}*LuxI-LVA"]
#no Plac
["luxI-LVA",["Plac","AHL","IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"{{k}}*{{luxI}}*IPTG**{{n}}/(IPTG**{{n}}+{{kd}})"]
#no LuxI-LVA
["luxI-LVA",["Plac","LuxI-LVA","IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"-{{d}}*LuxI-LVA"]
#no AHL
["luxI-LVA",["IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"-{{d}}*LuxI-LVA"]
#no IPTG
["luxI-LVA",["AHL","IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"-{{d}}*LuxI-LVA"]
#no Plac,LuxI-LVA
["luxI-LVA",["LuxI-LVA","IPTG","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"-{{d}}*LuxI-LVA"]
#no Plac,AHL
["luxI-LVA",["AHL","LuxI-LVA","LuxI","LVA"],[("k",6.74),("d",3.55),("luxI",150),("kd",3.84),("n",3)],"-{{d}}*LuxI-LVA"]
#no Plac,IPTG


["LuxR",["AHL","Plac"],[("k",4.69),("luxR",150),("d",3.55)],"{{k}}*{{luxR}}*AHL-{{d}}*LuxR"]
#all
["LuxR",["Plac"],[("k",4.69),("luxR",150),("d",3.55)],"-{{d}}*LuxR"]
#no AHL
["LuxR",["AHL"],[("k",4.69),("luxR",150),("d",3.55)],"-{{d}}*LuxR"]
#no Plac

["CCDB",["PluxR","LuxR"],[("k",5.93),("d",3.55),("ccdB",150),("n_{LuxR}",2),("k_{LuxR}",3.46)],"{{k}}*{{ccdB}}/(1+(LuxR/{{k_{LuxR}}})**{{n_{LuxR}}})-{{d}}*CCDB"]
#all
["CCDB",["LuxR"],[("k",5.93),("d",3.55),("ccdB",150),("n_{LuxR}",2),("k_{LuxR}",3.46)],"-{{d}}*CCDB"]
#no PluxR
["CCDB",["PluxR"],[("k",5.93),("d",3.55),("ccdB",150),("n_{LuxR}",2),("k_{LuxR}",3.46)],"{{k}}*{{ccdB}}-{{d}}*CCDB"]
#no LuxR
