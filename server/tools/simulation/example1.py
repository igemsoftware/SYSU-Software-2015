# -*- coding: utf-8 -*-
"""
    example from http://modelling3e4.connectmv.com/wiki/Software_tutorial/Integration_of_ODEs
"""

import numpy as np
from scipy import integrate
import matplotlib
# in cygwin
matplotlib.use('Agg') 
from matplotlib.pylab import *

def tank(t, y):
    """
    Dynamic balance for a CSTR
 
    C_A = y[0] = the concentration of A in the tank, [mol/L]
    T   = y[1] = the tank temperature, [K]
 
    Returns dy/dt = [F/V*(C_{A,in} - C_A) - k*C_A^2       ]
                    [F/V*(T_in - T) - k*C_A^2*HR/(rho*Cp) ]
    """

    F = 20.1     # L/min
    CA_in = 2.5  # mol/L
    V = 100.0    # L
    k0 = 0.15    # L/(mol.min)
    Ea = 5000    # J/mol
    R = 8.314    # J/(mol.K)
    Hr = -590    # J/mol
    T_in = 288   # K
    rho = 1.050  # kg/L
 
    # Assign some variables for convenience of notation
    CA = y[0]
    T  = y[1]
 
    # Algebraic equations
    k = k0 * np.exp(-Ea/(R*T))  # L/(mol.min)
    Cp = 4.184 - 0.002*(T-273)  # J/(kg.K)
 
    # Output from ODE function must be a COLUMN vector, with n rows
    n = len(y)      # 2: implies we have two ODEs
    dydt = np.zeros((n,1))
    dydt[0] = F/V*(CA_in - CA) - k*CA**2
    dydt[1] = F/V*(T_in - T) - (Hr*k*CA**2)/(rho*Cp)
    return dydt
 
# The ``driver`` that will integrate the ODE(s):
if __name__ == '__main__':
    # Start by specifying the integrator:
    # use ``vode`` with "backward differentiation formula"
    r = integrate.ode(tank).set_integrator('vode', method='bdf')
 
    # Set the time range
    t_start = 0.0
    t_final = 45.0
    delta_t = 0.1
    # Number of time steps: 1 extra for initial condition
    num_steps = np.floor((t_final - t_start)/delta_t) + 1
 
    # Set initial condition(s): for integrating variable and time!
    CA_t_zero = 0.5
    T_t_zero = 295.0
    r.set_initial_value([CA_t_zero, T_t_zero], t_start)
 
    # Additional Python step: create vectors to store trajectories
    t = np.zeros((num_steps, 1))
    CA = np.zeros((num_steps, 1))
    temp = np.zeros((num_steps, 1))
    t[0] = t_start
    CA[0] = CA_t_zero
    temp[0] = T_t_zero
 
    # Integrate the ODE(s) across each delta_t timestep
    k = 1
    while r.successful() and k < num_steps:
        r.integrate(r.t + delta_t)
 
        # Store the results to plot later
        t[k] = r.t
        CA[k] = r.y[0]
        temp[k] = r.y[1]
        k += 1
 
#    print(t, CA)

    # All done!  Plot the trajectories in two separate plots:
    fig = figure()
    ax1 = subplot(211)
    ax1.plot(t, CA)
    ax1.set_xlim(t_start, t_final)
    ax1.set_xlabel('Time [minutes]')
    ax1.set_ylabel('Concentration [mol/L]')
    ax1.grid('on')
 
    ax2 = plt.subplot(212)
    ax2.plot(t, temp, 'r')
    ax2.set_xlim(t_start, t_final)
    ax2.set_xlabel('Time [minutes]')
    ax2.set_ylabel('Temperaturere [K]')
    ax2.grid('on')
 
    fig.savefig('coupled-ode-Python.png')
