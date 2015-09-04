# CORE - Crowdsourcing Open Redesign Engine

## Introduction 

CORE is a Crowdsourcing Open Redesign Engine for Synthetic Biology. It contains three major parts:

  - Co-development: A platform for biologists to ask or to answer a question.
  - CORE Design: A series of toolkits used to design a circuit with existing devices or parts. All works can be done with visualization tools with a high design freedom.
  - CORE Bank: A database that biologists can store, fetch and share their circuit.

## Requirements

//blablabla python, nose ...

CORE is a server-based software using [Flask](http://flask.pocoo.org/) as back-end and [Semantic](http://semantic-ui.com/) as front-end.

Other required packages are listed in `requirements.txt`.

Run `pip install -r requirements.txt` to get requirements installed.

## Installation

Local usage:

- Run `python manager.py init` to initialize the database.
- Run `python core.py` to run CORE on localhost.

## Advanced usage

### On the shoulders of giants: 
The primitive CORE contains nothing except few necessary information to support the software. If you want to start with some parts, devices and tasks that we collected for you, run `python manager.py testinit` instead. You can acquire many useful components and feel less lonely.

### Share a database within lab:
It is **highly recommended** to deploy CORE on a public (like world-wide-web) or semi-public (like laboratory) server. Because users can cooperate with each other by answering others' question or by sharing their devices.

We assume that you are a lab server manager and possess the basic ability of deploying a server-based software (or ask students in CS for help). You just need to change the `HOST` and `PORT` in `core.py` and re-run `python core.py` to restart the software.

### Multiple-platfrom development
If your are a developer who hopes to use CORE on IOS, Android or other platforms, we provide miscellaneous interfaces for further development:

- Deploy CORE on an accessable server without modifying anything.
- Access the interface via any platform to retrive/update the information.

## Documentation

Build with `xxxx`

See in `/docs`

## FAQ

## Credits

SYSU-Software-2015 

## LICENSE

CORE use GLGPL 3.0 license. See more details in `LICENSE`.

## Version Log

