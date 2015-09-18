["Spot42_USP45",["Promoter"],[("alpha_{Spot42_USP45}",3.21),("spot42_usp45",150),("d",0.742)],"{{alpha_{Spot42_USP45}}}*{{spot42_usp45}}-{{d}}*Spot42_USP45"]
#all
["Spot42_USP45",[],[("alpha_{Spot42_USP45}",3.21),("spot42_usp45",150),("d",0.742)],"-{{d}}*Spot42_USP45"]
#no Promoter

["USP45_CFY",["Promoter","Spot42_USP45"],[("alpha_{USP45_CFY}",3.93),("usp45_cfy",150),("n_{Spot42_USP45}",2),("beta_{Spot42_USP45}",2.8),("d",0.742)],"{{alpha_{USP45_CFY}}}*{{usp45_cfy}}/(1+(Spot42_USP45)/{{beta_{Spot42_USP45}}}**{{n_{Spot42_USP45}}})-{{d}}*USP45_CFY"]
#all
["USP45_CFY",["Spot42_USP45"],[("alpha_{USP45_CFY}",3.93),("usp45_cfy",150),("n_{Spot42_USP45}",2),("beta_{Spot42_USP45}",2.8),("d",0.742)],"-{{d}}*USP45_CFY"]
#no Promoter
["USP45_CFY",["Promoter","Spot42_USP45"],[("alpha_{USP45_CFY}",3.93),("usp45_cfy",150),("n_{Spot42_USP45}",2),("beta_{Spot42_USP45}",2.8),("d",0.742)],"{{alpha_{USP45_CFY}}}*{{usp45_cfy}}-{{d}}*USP45_CFY"]
#no Spot42_USP45