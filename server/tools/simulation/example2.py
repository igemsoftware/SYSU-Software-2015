# -*- coding: utf-8 -*-

import numpy as np
from scipy import integrate
import matplotlib
# in cygwin
matplotlib.use('Agg') 
from matplotlib.pylab import *

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

    b = 1./(1+(puvr8*ptetr))
    c = 1./(1+pci)

    n = len(y)
    dydt = np.zeros((n, 1))
    dydt[0] = t
    dydt[1] = a*dna/(1+UVB ** k) - u1*puvr8
    dydt[2] = b*dna - u2*pci
    dydt[3] = c*dna - u3*ptetr
    dydt[4] = b*dna/(1+GFP ** a1) - u4*YFP
    dydt[5] = c*dna/(1+YFP ** a1) - u4*GFP

    return dydt

if __name__ == '__main__':
    # Start by specifying the integrator:
    # use ``vode`` with "backward differentiation formula"
    r = integrate.ode(yfp_gfp).set_integrator('vode', method='bdf')

    # Set the time range
    t_start = 0.0
    t_final = 3.0
    delta_t = 0.05
    # Number of time steps: 1 extra for initial condition
    num_steps = np.floor((t_final - t_start)/delta_t) + 1

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


