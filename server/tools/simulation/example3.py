# -*- coding: utf-8 -*-

import numpy as np
from scipy import integrate
import matplotlib
# in cygwin
matplotlib.use('Agg') 
from matplotlib.pylab import *

# compared
def yfp_gfp(t, y):
    a = 80.
    k = 50.
    a1 = 20.
    a2 = 20.
    u1 = 20.
    u2 = 20.
    u3 = 20.
    u4 = 20.
    dna = 150.

    UVB = y[0]
    puvr8 = y[1]
    pci = y[2]
    ptetr = y[3]
    YFP = y[4]
    GFP = y[5]

    n = len(y)
    dydt = np.zeros((n, 1))
    dydt[0] = t
    dydt[1] = a*dna/(1+UVB ** k) - u1*puvr8
    dydt[2] = 1./(1+(puvr8*ptetr)) *dna - u2*pci
    dydt[3] = 1./(1+pci) *dna - u3*ptetr
    dydt[4] = 1./(1+(puvr8*ptetr)) *dna/(1+GFP ** a1) - u4*YFP
    dydt[5] = 1./(1+pci) *dna/(1+YFP ** a1) - u4*GFP

    return dydt




from equation import Equation

__example_system = [
['UVB', [], [], 't'],
['puvr8', ['UVB'], [('a',80.), ('dna', 150.), ('k', 50.), ('u1', 20.)], '{{a}}*{{dna}}/(1+UVB ** {{k}}) - {{u1}}*puvr8'],
['pci', ['puvr8', 'ptetr'], [('dna', 150.), ('u2', 20.)], '1./(1+(puvr8*ptetr)) *{{dna}} - {{u2}}*pci'],
['ptetr', ['pci'], [('dna', 150.), ('u3', 20.)], '1./(1+pci) *{{dna}} - {{u3}}*ptetr'],
['YFP', ['puvr8', 'ptetr', 'GFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+(puvr8*ptetr)) *{{dna}}/(1+GFP ** {{a1}}) - {{u4}}*YFP'],
['GFP', ['pci', 'YFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+pci) *{{dna}}/(1+YFP ** {{a1}}) - {{u4}}*GFP'],
#['a', [], [], 'abs(a)'],
]

from math import *

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

def getModel(system): 
    # check dependancy
    set_provided = set([equ[0] for equ in system]) 
    set_needed = set(reduce(lambda x, y: x+y, [equ[1] for equ in system])) 
    if not set_needed <= set_provided:
        print 'Needed value is not provided.'
        return None 
    else:
        print 'Dependancy test pass.'

    # check valid
    rendered = []
    for equ in system:
        e = Equation(dict(equ[2]), equ[3])
        var = [equ[0]]+equ[1]+['t']
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
            print '\t', exp
    
    def ODEModel(t, y):
        calc_dict = dict(zip([ele[0] for ele in system], y))
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

if __name__ == '__main__':
    ODEModel, names = getModel(__example_system)
    print yfp_gfp(102, [5,2,3,4,5,6])
    print ODEModel(102, [5,2,3,4,5,6]) 

    t, result = simulate(ODEModel, names, 0, 3.0, 0.05, [0,0,0,0,0,0])
    
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



if __name__ == '__test__':
    # Start by specifying the integrator:
    # use ``vode`` with "backward differentiation formula"
    r = integrate.ode(yfp_gfp).set_integrator('vode', method='bdf')

    # Set the time range
    t_start = 0.0
    t_final = 3.0
    delta_t = 0.05
    # Number of time steps: 1 extra for initial condition
    num_steps = np.floor((t_final - t_start)/t_delta) + 1

    # Set initial condition(s): for integrating variable and time!
    initial_value = [0,0,0,0,0,0]
    r.set_initial_value(initial_value, t_start)

    # Additional Python step: create vectors to store trajectories
    t = np.zeros((num_steps, 1))
    UVB = np.zeros((num_steps, 1))
    puvr8 = np.zeros((num_steps, 1))
    pci = np.zeros((num_steps, 1))
    ptetr =  np.zeros((num_steps, 1))
    YFP = np.zeros((num_steps, 1))
    GFP = np.zeros((num_steps, 1))
    temp = np.zeros((num_steps, 1))

    t[0] = t_start
    UVB[0] = 0
    puvr8[0] = 0
    pci[0] = 0
    ptetr[0] = 0
    YFP[0] = 0
    GFP[0] = 0

    # Integrate the ODE(s) across each delta_t timestep
    k = 1
    while r.successful() and k < num_steps:
        r.integrate(r.t + delta_t)
 
        # Store the results to plot later
        t[k] = r.t
        UVB[k] = r.y[0]
        puvr8[k] = r.y[1]
        pci[k] = r.y[2]
        ptetr[k] = r.y[3]
        YFP[k] = r.y[4]
        GFP[k] = r.y[5]

        k += 1

    puvr8 /= puvr8.max() * GFP.max()

    fig = figure()
    ax1 = subplot(111)
    line_UVB, = ax1.plot(t, UVB, label ='UVB')
#    line_puvr8, = ax1.plot(t, puvr8, label = 'puvr8')
    line_pci, = ax1.plot(t, pci, label = 'pci')
    line_ptetr, = ax1.plot(t, ptetr, label = 'ptetr')
    line_YFP, = ax1.plot(t, YFP, label = 'YFP')
    line_GFP, = ax1.plot(t, GFP, label = 'GFP')
    ax1.set_xlim(t_start, t_final)
    ax1.legend(handles=\
        [line_UVB,line_pci,\
        line_ptetr,line_YFP,line_GFP])
    ax1.grid('on')

    fig.savefig('gfp_yfp.png')


