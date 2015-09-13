#   ('a_{cs}', 5)
#   ('k_{cc}', 1)
#   ('k_{cd}', 1)
#   ('d_{CqsS}', 0.5)
#   ('d_{CqsSp}', 1)
#   ('alaph_{U}', 5)
#   ('beta_{cu}', 1)
#   ('k_{cu}', 2)
#   ('d_{LuxU}', 0.65)
#   ('d_{LuxUp}', 0.12)
#   ('beta_{uo}', 3.2)
#   ('k_{uo}', 2)
#   ('d_{LuxOp}', 0.12)
#   ('atr', 1)
#   ('d_{TetR}', 0.12)
#   ('h_{0}', 1.5)
#   ('n', 3)
#   ('d_{TetA}', 0.12)
#   ('beta_{TetR}', 5)

['CqsS', ['CqsSp'], [('a_{cs}', 5),('k_{cc}', 1),('k_{cd}', 1),('d_{CqsS}', 0.5)], '{{a_{cs}}}-{{k_{cc}}}*CqsS+{{k_{cd}}}*CqsSp-{{d_{CqsS}}}*CqsS']
['CqsS', [], [('d_{CqsS}', 0.5)], '-{{d_{CqsS}}}*CqsS']


['CqsSq', ['CAI'], [('k_{cc}', 1),('k_{cd}', 1),('d_{CqsSp}', 1)], '{{k_{cc}}}*CAI - {{k_{cd}}}*CqsSp - {{d_{CqsSp}}}*CqsSp']

