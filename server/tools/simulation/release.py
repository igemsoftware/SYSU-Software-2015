import numpy as np
from math import *
from scipy import integrate

# safe eval function protection is 
#    from http://lybniz2.sourceforge.net/safeeval.html 
#make a list of safe functions
safe_list = ['math','acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'cosh', 'degrees', 
'e', 'exp', 'fabs', 'floor', 'fmod', 'frexp', 'hypot', 'ldexp', 'log', 
'log10', 'modf', 'pi', 'pow', 'radians', 'sin', 'sinh', 'sqrt', 'tan', 'tanh']
#use the list to filter the local namespace
safe_dict = dict([ (k, locals().get(k, None)) for k in safe_list ])
#add any needed builtins back in.
safe_dict['abs'] = abs
# protection end

from equation import Equation
import traceback

__example_system = [
['UVB', [], [], 't'],
['puvr8', ['UVB'], [('a',80.), ('dna', 150.), ('k', 50.), ('u1', 20.)], '{{a}}*{{dna}}/(1+UVB ** {{k}}) - {{u1}}*puvr8'],
['pci', ['puvr8', 'ptetr'], [('dna', 150.), ('u2', 20.)], '1./(1+(puvr8*ptetr)) *{{dna}} - {{u2}}*pci'],
['ptetr', ['pci'], [('dna', 150.), ('u3', 20.)], '1./(1+pci) *{{dna}} - {{u3}}*ptetr'],
['YFP', ['puvr8', 'ptetr', 'GFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+(puvr8*ptetr)) *{{dna}}/(1+GFP ** {{a1}}) - {{u4}}*YFP'],
['GFP', ['pci', 'YFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+pci) *{{dna}}/(1+YFP ** {{a1}}) - {{u4}}*GFP'],
]

def getModel(system, dependancy_check=False): 
    # check dependancy
    set_provided = set([equ[0] for equ in system]) 
    set_needed = set(reduce(lambda x, y: x+y, [equ[1] for equ in system])) 

# dependancy checking is not needed.
    if dependancy_check:
        if not set_needed <= set_provided:
            print 'needed:', set_needed
            print 'provided:', set_provided
            print 'Needed value is not provided.'
            return None, 'Needed value is not provided.'
        else:
            print 'Dependancy test: pass.'

    # check valid
    rendered = []
    for equ in system:
        e = Equation(dict(equ[2]), equ[3].replace(':', '_'))
        var = [ele.replace(':', '_') for ele in [equ[0]]+equ[1]+['t'] ]
        eval_dict = dict(zip(var, [0.]*len(var)))
        eval_dict['__builtins__'] = None

        print '='*20
        try:
            testv = eval(e.render(), eval_dict, safe_dict)
            print 'Test pass:', e.render()
            print '\tValue(all 0):', testv
            rendered.append(e.render())
        except Exception, exp:
            print 'Test error:', e.render()
            msg = traceback.format_exc()
            #print '\t', exp.message
            print msg
            return None, msg
    
    def ODEModel(t, y):
        calc_dict = dict(zip([ele[0].replace(':', '_') for ele in system], y))
        calc_dict['__builtins__'] = None
        calc_dict['t'] = t
        
        n = len(y)
        dydt = np.zeros((n, 1))
        for i in range(len(y)):
            dydt[i] = eval(rendered[i], calc_dict, safe_dict)
        return dydt 
    return ODEModel, [ele[0] for ele in system]

def simulate(ODEModel, names, t_start, t_final, t_delta, initial_value):
    r = integrate.ode(ODEModel).set_integrator('vode', method='bdf')
    r.set_initial_value(initial_value, t_start)

    num_steps = np.floor((t_final - t_start)/t_delta) + 1

    t = np.zeros((num_steps, 1))
    data = np.zeros((num_steps, len(names)))
    
    k = 1
    while r.successful() and k < num_steps:
        r.integrate(r.t + t_delta)
 
        # Store the results to plot later
        t[k] = r.t
        data[k] = r.y.T
        k += 1

    l = []
    for name, num in zip(names, data.T):
        l.append({'name': name,
                  'data': num.flatten().tolist()})
    return t.flatten().tolist(), l

if __name__ == '__never__':
    ODEModel, names = getModel(__example_system)
    t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0,0,0,0,0,0])

    import matplotlib
    matplotlib.use('Agg')  # in cygwin
    from matplotlib.pylab import *
    
    fig = figure()
    ax1 = subplot(111)
    l = []
    for ele in result:
        line, = ax1.plot(t, ele['data'], label=ele['name'])
        l.append(line)
    ax1.set_xlim(0, 3.0)
    ax1.legend(handles=l)
    ax1.grid('on')
    fig.savefig('gfp_yfp.png')


