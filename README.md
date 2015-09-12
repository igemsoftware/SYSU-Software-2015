<p align="center"><img src="https://raw.githubusercontent.com/igemsoftware/SYSU-Software-2015/master/server/static/img/common/logo.png"></p>

<p align="center">
  <a href="https://magnum.travis-ci.com/igemsoftware/SYSU-Software-2015"><img src="https://circleci.com/gh/yyx990803/vue/tree/master.svg?style=shield" alt="Build Status"></a>
</p>

## Introduction 

CORE is a Crowdsourcing Open Redesign Engine for Synthetic Biology. It contains three major parts:

  - Co-development: A crowdsourcing and Q&A platform. Helps synthetic biologists to identify problems and improve designs via communication and co-development.
  - CORE Design: A genetic circuit design and experiment management tool. Helps users re-engineer existing design in an economic and convenient way. Numerical simulation and experiment management meet the wet lab's needs.
  - CORE Bank: A repository of previous genetic circuit designs. Helps avoid re-inventing the wheel through redesign of existing ones. Promotes information parsing with uniform presentation styles.

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

- `cd docs/`
- Build with `sphinx-build -b html -d _build/doctrees . _build/html`
- See in `_build/html/index.html`

## FAQ

## Credits

SYSU-Software-2015 

## LICENSE

CORE use GLGPL 3.0 license. See more details in `LICENSE`.

## Version Log

