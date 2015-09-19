'''
Version information
-------------------

* 1.0 Basic simulation

 * 1.1 Basic numeric simulation 
 * 1.2 Add resolution support

* 2.0 Exception handling system

 * 2.1 Remove dependancy check to view
 * 2.2 Using traceback to log error message

* 3.0 Use the original part to identify

 * 3.1 Allow punctuation in raw equation 
 * 3.2 Fix name bug
 * 3.3 Fix number bug 
 * 3.4 Refix number bug to avoid collision

* 4.0 Can starts with non-zero initial value

 * 4.1 Allow user to simulate with specific initial value
 * 4.2 Build a frontend interface for website user

* 5.0 Can set variables as coeffcients  

 * 5.1 Tranlate coefficients into variables with initial value 
 * 5.2 Variables can have independent initval value
 * 5.3 Data update

* 6.0 Multiple sources 

 * 6.1 Add the target of equation into database to accelerate the query process
 * 6.2 Variable-wise query can sum up different equations
    
* 7.0 Use plasmid information to double-validate the system

 * 7.1 Check whether the equation is connecting the aimed promoter and gene/cds

APIs
----
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
    """
        In order to eliminate the effect of punctuation.
    """
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
    """
        :system: the equation system.

        Get the ODE model to simulate from system.
    """
    # check dependancy
    set_provided = set([equ[0] for equ in system]) 
    set_needed = set(reduce(lambda x, y: x+y, [equ[1] for equ in system], [])) 

    # dependancy checking is not needed.
    if dependancy_check:
        # the needed set is included in the provided set
        if not set_needed <= set_provided:
            auto = set_needed - set_provided
            for ele in list(auto):
                system.append([ele, [], [], '0'])
            # debug code
    #       print 'needed:', set_needed
    #       print 'provided:', set_provided
    #       print 'Needed value is not provided.'
    #       return None, 'Needed value is not provided.'
    #   else:
    #       print 'Dependancy test: pass.'

    # check valid
    rendered = []
    for equ in system:
        # e is the Equation object
        e = Equation(dict(equ[2]), equ[3].replace(':', '_'))
        # all the variables
        var = [ele.replace(':', '_') for ele in [equ[0]]+equ[1]+['t'] ]

        # the look-up table of variables
        eval_dict = dict(zip(var, [0.]*len(var)))
        eval_dict['__builtins__'] = None

        try:
            # try to evaluate the formula
            testv = eval(e.render(), eval_dict, safe_dict)
#           print 'Test pass:', equ
#           print '\tValue(all 0):', testv
            rendered.append(e.render())
        except Exception, exp:
            print 'Test error:', equ
            msg = traceback.format_exc()
            #print '\t', exp.message
            print msg
            return None, msg, None
    
    def ODEModel(t, y):
        # A wrapper function to get the ODE update model
        calc_dict = dict(zip([ele[0].replace(':', '_') for ele in system], y))
        calc_dict['__builtins__'] = None
        calc_dict['t'] = t
        
        n = len(y)
        dydt = np.zeros((n, 1))
        for i in range(len(y)):
            # the defferential equations
            dydt[i] = eval(rendered[i], calc_dict, safe_dict)
        return dydt 
    return ODEModel, system, [ele[0] for ele in system]

def simulate(ODEModel, names, t_start, t_final, t_delta, initial_value):
    """
        :ODEModel: The ODE model used to simulate.
        :names: Names of variables.
        :t_final: Maximum simulation time.
        :t_delta: The interval of the simulation.
        :initial_value: The initial value of each variables
    """
    # dopri5 is the same as ODE45 in Matlab
    r = integrate.ode(ODEModel).set_integrator('dopri5', method='bdf')
    r.set_initial_value(initial_value, t_start)

    num_steps = (t_final - t_start)/t_delta + 1

    t = np.zeros((num_steps, 1))
    data = np.zeros((num_steps, len(names)))
    data[0] = np.array(initial_value).T 
    
    k = 1
    # the simulation loop
    while r.successful() and k < num_steps:
        r.integrate(r.t + t_delta)
 
        # Store the results to plot later
        t[k] = r.t
        data[k] = r.y.T
        k += 1

    l = []
    # packed the data together
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


