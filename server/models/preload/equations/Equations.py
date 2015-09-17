['UVB', [], [], 't']

['UVR8-TetR', ['Promoter', 'UVB'], [('a',80.), ('dna', 150.), ('k', 50.), ('u1', 20.)], '{{a}}*{{dna}}/(1+UVB ** {{k}}) - {{u1}}*UVR8-TetR']
['UVR8-TetR', [], [('u1', 20.)], '-{{u1}}*UVR8-TetR']

['CI', ['Ptet', 'UVR8-TetR', 'TetR'], [('dna', 150.), ('u2', 20.)], '1./(1+(UVR8-TetR*TetR)) *{{dna}} - {{u2}}*CI']
['CI', [], [('u2', 20.)], '-{{u2}}*CI']

['TetR', ['PcI', 'CI'], [('dna', 150.), ('u3', 20.)], '1./(1+CI) *{{dna}} - {{u3}}*TetR']
['TetR', [], [('u3', 20.)], '-{{u3}}*TetR']

['YFP', ['Ptet','UVR8-TetR', 'TetR', 'GFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+(UVR8-TetR*TetR)) *{{dna}}/(1+GFP ** {{a1}}) - {{u4}}*YFP']
['YFP', ['Ptet','UVR8-TetR', 'TetR'], [('dna', 150.), ('u4', 20.)], '1./(1+(UVR8-TetR*TetR)) *{{dna}}/(1) - {{u4}}*YFP']
['YFP', ['Ptet','TetR', 'GFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+(TetR)) *{{dna}}/(1+GFP ** {{a1}}) - {{u4}}*YFP']
['YFP', ['Ptet','TetR'], [('dna', 150.), ('u4', 20.)], '1./(1+(TetR)) *{{dna}}/(1) - {{u4}}*YFP']
['YFP', [], [('u4', 20.)], '- {{u4}}*YFP']

['GFP', ['PcI','CI', 'YFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+CI) *{{dna}}/(1+YFP ** {{a1}}) - {{u4}}*GFP']
['GFP', ['PcI','CI'], [('dna', 150.), ('u4', 20.)], '1./(1+CI) *{{dna}}/(1) - {{u4}}*GFP']
['GFP', [], [('u4', 20.)], '- {{u4}}*GFP']

