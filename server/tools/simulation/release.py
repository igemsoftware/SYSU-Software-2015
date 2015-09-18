'''
    1.0 basic simulation
        1.1 fix bug
    2.0 exception handling system
        2.1 remove dependancy check 
        2.2
    3.0 use the original part name
        3.1 fix name bug
        3.2 fix number bug 
        3.3 refix number bug to avoid collision
    4.0 with initial value
        4.1 interface API
    5.0 coe into var
        5.1 tranlate coe into var
        5.1 var with initval
'''
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
import string

def name_handler(s):
    for ele in ':/ -)(*':
        s = s.replace(ele, '_')
    if s[0] in string.digits:
        s = '_'+s
    return s

# old version
##  def name_handler(string):
##      return string.replace(':', '_').replace('/','_').replace(' ', '_').replace('-','_').replace(')','').replace('(','_').replace('*','_')


__example_system = [
['UVB', [], [], 't'],
['puvr8', ['UVB'], [('a',80.), ('dna', 150.), ('k', 50.), ('u1', 20.)], '{{a}}*{{dna}}/(1+UVB ** {{k}}) - {{u1}}*puvr8'],
['pci', ['puvr8', 'ptetr'], [('dna', 150.), ('u2', 20.)], '1./(1+(puvr8*ptetr)) *{{dna}} - {{u2}}*pci'],
['ptetr', ['pci'], [('dna', 150.), ('u3', 20.)], '1./(1+pci) *{{dna}} - {{u3}}*ptetr'],
['YFP', ['puvr8', 'ptetr', 'GFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+(puvr8*ptetr)) *{{dna}}/(1+GFP ** {{a1}}) - {{u4}}*YFP'],
['GFP', ['pci', 'YFP'], [('dna', 150.), ('a1', 20.), ('u4', 20.)], '1./(1+pci) *{{dna}}/(1+YFP ** {{a1}}) - {{u4}}*GFP'],
]

def getModel(system, dependancy_check=True): 
    # check dependancy
    set_provided = set([equ[0] for equ in system]) 
    set_needed = set(reduce(lambda x, y: x+y, [equ[1] for equ in system])) 

# dependancy checking is not needed.
    if dependancy_check:
        if not set_needed <= set_provided:
            auto = set_needed - set_provided
            for ele in list(auto):
                #print ele
                system.append([ele, [], [], '0'])
    #       print 'needed:', set_needed
    #       print 'provided:', set_provided
    #       print 'Needed value is not provided.'
    #       return None, 'Needed value is not provided.'
    #   else:
    #       print 'Dependancy test: pass.'

    # check valid
    rendered = []
    for equ in system:
        e = Equation(dict(equ[2]), equ[3].replace(':', '_'))
        var = [ele.replace(':', '_') for ele in [equ[0]]+equ[1]+['t'] ]
        eval_dict = dict(zip(var, [0.]*len(var)))
        eval_dict['__builtins__'] = None

#        print '='*20
        try:
            testv = eval(e.render(), eval_dict, safe_dict)
            print 'Test pass:', equ
            print '\tValue(all 0):', testv
            rendered.append(e.render())
        except Exception, exp:
            print 'Test error:', equ
            msg = traceback.format_exc()
            #print '\t', exp.message
            print msg
            return None, msg, None
    
    def ODEModel(t, y):
        calc_dict = dict(zip([ele[0].replace(':', '_') for ele in system], y))
        calc_dict['__builtins__'] = None
        calc_dict['t'] = t
        
        n = len(y)
        dydt = np.zeros((n, 1))
        for i in range(len(y)):
            dydt[i] = eval(rendered[i], calc_dict, safe_dict)
        return dydt 
    return ODEModel, system, [ele[0] for ele in system]

def simulate(ODEModel, names, t_start, t_final, t_delta, initial_value):
#    r = integrate.ode(ODEModel).set_integrator('vode', method='bdf')
    r = integrate.ode(ODEModel).set_integrator('dopri5', method='bdf')
    r.set_initial_value(initial_value, t_start)

#    t_delta = (t_final - t_start)/(num_steps-1)
    num_steps = (t_final - t_start)/t_delta + 1

    t = np.zeros((num_steps, 1))
    data = np.zeros((num_steps, len(names)))
    data[0] = np.array(initial_value).T 
    
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


