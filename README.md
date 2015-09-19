<p align="center"><img src="https://raw.githubusercontent.com/igemsoftware/SYSU-Software-2015/master/server/static/img/common/logo.png"></p>

<p align="center">
  <a href="https://travis-ci.org/igemsoftware/SYSU-Software-2015.svg?branch=master"><img src="https://travis-ci.org/igemsoftware/SYSU-Software-2015.svg?branch=master" alt="Build Status"></a>
</p>

## Introduction

CORE is a Crowdsourcing Open Redesign Engine for Synthetic Biology. It contains three major parts:

  - Co-development: Crowdsourcing platform for collaborative design. Collaboration results in great projects. Crowdsourcing helps synthetic biologists identify problems and co-develop their constructs.
  - CORE Design: A Standardized Genetic Design Bank. Reuse and re-design lead to efficiency. Standard repository of genetic design helps “stand on the shoulder of the giants” while prevent “re-inventing the wheels”.
  - CORE Bank: Integrated solutions for wet-lab assistance. For Synbio, genetic design is the basis but not the whole story. Mathematical modeling, plasmid design, protocol management and experiment schedule are good auxiliaries.

## Requirements

Here list only the main dependencies. For a complete list, please see `requirements.txt` and `docs_requirements.txt`.

* `flask`: Python web backend microframework.
* `sphinx`: Automatic documentation generating tool.
* `numpy` and `scipy`: ODE solver for the modeling part.
* `nose`: Automatic Unit Testing.

## Installation

### For Normal Users
In most cases, you *won't* care about how to install the server, because we have one that is accessible publicly :smile:
The online version is located [here](http://core.sysusoftware.info).

### For Advanced Users
If you really want to host a separate copy of the server, you have two options.

1. The BLUE pill: use one of our releases [here](https://github.com/igemsoftware/SYSU-Software-2015/releases). It's designed especially for easy deploying.
2. The RED pill: you will need knowledge about python and the command line. General instructions can be found below. Note that you normally **really** don't need to get your hands dirty. Discussion about this can be found in **Advanced Usage** section of this file.

Basic command-line setup instructions:
```
# Clone this repo
git clone https://github.com/igemsoftware/SYSU-Software-2015

# Install dependencies
pip2 install -r requirements.txt

# Initializing the database
python manager.py init

# run the server
python core.py
```

## Advanced usage

### On the shoulders of giants:
The primitive CORE contains nothing except few necessary information to support the software. If you want to start with some parts, devices and tasks that we collected for you, run `python manager.py userinit` instead. You can acquire many useful components and feel less lonely.

### Share a database within lab:
It is **highly recommended** to deploy CORE on a public (like world-wide-web) or semi-public (like laboratory) server. Because users can cooperate with each other by answering others' question or by sharing their devices.

We assume that you are a lab server manager and possess the basic ability of deploying a server-based software (or ask students in CS for help). You just need to change the `HOST` and `PORT` in `core.py` and re-run `python core.py` to restart the software.

### Multiple-platform development
If you are a developer who hopes to use CORE on IOS, Android or other platforms, we provide miscellaneous interfaces for further development:

- Deploy CORE on an accessible server without modifying anything.
- Access the interface via any platform to retrieve/update the information.

## Documentation

- `cd docs/`
- Build with `sphinx-build -b html -d _build/doctrees . _build/html`
- See in `_build/html/index.html`

## FAQ

## Credits

SYSU-Software-2015

## LICENSE

CORE uses LGPL 3.0 license. See more details in `LICENSE`.

## Version Log
1. 0.8.0: released on Sept 14th, 2015.

