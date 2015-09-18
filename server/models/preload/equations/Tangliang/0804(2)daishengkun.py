["IP",["Ckx"],[("k_{dip}",1.5),("k_{dil}",1.27),("k_{deg}",0.93),("kd",2.8)],"-({{k_{dil}}}+{{k_{dip}}})*IP-{{k_{deg}}}*Ckx*IP/({{kd}}+IP)"]
#all
["IP",[],[("k_{dip}",1.5),("k_{dil}",1.27),("k_{deg}",0.93),("kd",2.8)],"-({{k_{dil}}}+{{k_{dip}}})*IP"]
#no Ckx

["ATCRE1",["IP","PCyc1"],[("alpha_{ATCRE1}",3.62),("k_{deg}",0.93),("aTCERL",150)],"{{alpha_{ATCRE1}}}*{{aTCERL}}+{{alpha_{ATCRE1}}}*IP-{{k_{deg}}}*ATCRE1"]
#all
["ATCRE1",["PCyc1"],[("alpha_{ATCRE1}",3.62),("k_{deg}",0.93),("aTCERL",150)],"-{{k_{deg}}}*ATCRE1"]
#no IP
["ATCRE1",["IP"],[("alpha_{ATCRE1}",3.62),("k_{deg}",0.93),("aTCERL",150)],"-{{k_{deg}}}*ATCRE1"]
#no PCyc1

["YPD1",["ATCRE1"],[("alpha_{YPD1}",2.83),("k_{deg}",0.93),("n",2),("kd",2.8)],"{{alpha_{YPD1}}}*ATCRE1**{{n}}/({{kd}}+ATCRE1**{{n}})-{{k_{deg}}}*YPD1"]
#all
["YPD1",[],[("alpha_{YPD1}",2.83),("k_{deg}",0.93),("n",2),("kd",2.8)],"-{{k_{deg}}}*YPD1"]
#no ATCRE1

["PSSRE",["YPD1"],[("alpha_{PSSRE}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"{{alpha_{PSSRE}}}*YPD1**{{n}}/({{kd}}+YPD1**{{n}})-{{k_{deg}}}*PSSRE"]
#all
["PSSRE",[],[("alpha_{PSSRE}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"-{{k_{deg}}}*PSSRE"]
#no YPD1

["SKN7",["YPD1"],[("alpha_{SKN7}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"{{alpha_{SKN7}}}*YPD1**{{n}}/({{kd}}+YPD1**{{n}})-{{k_{deg}}}*SKN7"]
#all
["SKN7",[],[("alpha_{SKN7}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"-{{k_{deg}}}*SKN7"]
#no YPD1

["PSSRE",["SKN7"],[("alpha_{PSSRE}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"{{alpha_{PSSRE}}}*SKN7**{{n}}/({{kd}}+SKN7**{{n}})-{{k_{deg}}}*PSSRE"]
#all
["PSSRE",[],[("alpha_{PSSRE}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"-{{k_{deg}}}*PSSRE"]
#no SKN7


["GFP",["PSSRE"],[("alpha_{GFP}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"{{alpha_{GFP}}}*PSSRE**{{n}}/({{kd}}+PSSRE**{{n}})-{{k_{deg}}}*PSSRE"]
#all
["GFP",[],[("alpha_{GFP}",3.56),("n",2),("kd",2.8),("k_{deg}",0.93)],"-{{k_{deg}}}"]
#no PSSRE

["HOG1",["SSK1","PTP2"],[("alpha_{HOG1}",3.74),("n_{SSK1}",3),("n_{PTP2}",2),("beta_{SSK1}",4.2),("beta_{PTP2}",3.6),("k_{deg}",0.93)],"{{alpha_{HOG1}}}/(1+(SSK1/{{beta_{SSK1}}})**{{n_{SSK1}}})*(1+(PTP2/{{beta_{PTP2}}})**{{n_{PTP2}}})-{{k_{deg}}}*HOG1"]
#all
["HOG1",["SSK1"],[("alpha_{HOG1}",3.74),("n_{SSK1}",3),("n_{PTP2}",2),("beta_{SSK1}",4.2),("beta_{PTP2}",3.6),("k_{deg}",0.93)],"{{alpha_{HOG1}}}/(1+(SSK1/{{beta_{SSK1}}})**{{n_{SSK1}}})-{{k_{deg}}}*HOG1"]
#no PTP2
["HOG1",["PTP2"],[("alpha_{HOG1}",3.74),("n_{SSK1}",3),("n_{PTP2}",2),("beta_{SSK1}",4.2),("beta_{PTP2}",3.6),("k_{deg}",0.93)],"{{alpha_{HOG1}}}/(1+(PTP2/{{beta_{PTP2}}})**{{n_{PTP2}}})-{{k_{deg}}}*HOG1"]
#no SSK1
["HOG1",[],[("alpha_{HOG1}",3.74),("n_{SSK1}",3),("n_{PTP2}",2),("beta_{SSK1}",4.2),("beta_{PTP2}",3.6),("k_{deg}",0.93)],"-{{k_{deg}}}*HOG1"]
#no PTP2,SSK1
