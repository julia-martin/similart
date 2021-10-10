# similart

Art Recommendation System

## Github House Rules

* **Always** make a new branch for code changes. For free, private repositories it is not possible to enforce this as a setting but you should **never** push directly to the main branch.
* Let the code checks run before merging. Every time you open a pull request a series of basic style checks will be run on the code, if you've installed pre-commit (see below) you should have already addressed these changes, but this will check one more time. As above, it isn't possible in this type of repository to prevent the merge if checks do not pass, but you should wait.
* Be aware of when you need to pull fresh code that others have pushed, learn about [Rebases and Merges](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) and when (not) to use them.
* If you run into a merge conflict be sure to find an adult for assistance, these can be tricky to resolve correctly if you are not careful.

## Dev Setup Instructions

There a few steps that need to be taken to get setup and running.

First we'll install managers for both Python versions and Virtual Environments. If you are on Windows your life may be harder, virtual environments are not **stricly** necessary but you will likely be caused some degree of agony and heartbreak by not using them, as they keep the Python and package versions for this project separate from anything else you have running on your machine.

These instructions apply to MacOS and other *Nix systems, Windows versions of these tools do exist though.

* Clone the repo to your local machine. I prefer to use the SSH method, but HTTPS will work just fine too.
* Install [pyenv](https://github.com/pyenv/pyenv) and [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) with homebrew if you can, other ways if you must.
* Install Python 3.9.0 with `pyenv install 3.9.0`
* Navigate to the root of this project directory.
* Create a virtualenv for the repo with `pyenv virtualenv 3.9.0 similart`
* In the project root execute `echo 3.9.0/envs/similart > .python-version` (this is what tells pyenv-virtualenv to activate the correct environment in this directory)
* Run `pre-commit install` to add the same CI checks to your local machine.

Next we'll install development dependencies and get the package installed.

* Run `pip install -r requirements-dev.txt` This installs linters and other code-checks.
* Run `pip install -e .` This installs the package in **editable** mode, as you make changes to the code, things will change as you save files. Very useful.

I have included a `.flake8` file which contains configuration instructions for using flake8 as a linter. This can be imported into most code editors, VSCode, Pycharm etc. and allows us to have a consistent style as we write code together. Having said that, the checks are extremely lightweight and if you choose not to use them you are unlikely to cause issues unless you are reponsible for some truly horrific code.

At this point you should be ready to make changes to the code!

## The Project

This is built as a basic [Flask](https://flask.palletsprojects.com/en/2.0.x/) application. Flask is a lightweight framework for web-apps built in Python. The project is also structured as a [Python Package](https://packaging.python.org/tutorials/packaging-projects/). The history of how to package a Python project is fraught with much drama, the end result being that there remains to this day no consistent way to package Python projects. For this I may have mostly folllowed [PEP-518 guidelines](https://www.python.org/dev/peps/pep-0518/), by packaging the project we allow for the `pip install` command we used earlier.

Flask projects render templates found in the `templates` directory. The convention is that html template files live here, with CSS and JS code in the `static` directory. I have copied over a sample CSS file and the same d3 libraries from HW2 Q3 into this folder. We should be using something like [npm](https://www.npmjs.com/) for the JS library management, but I don't really know how to do that :-). As such, for front-end development you can work in the `templates` directory right away. You can add test routes to render templates and develop with limit outside input.

## Making Package Updates

Given that there are limited guidelines on project structure, there are also many methods to update package versions in Python. Consider following [Semantic Versioning](https://semver.org/) guidelines and update the `version.py` in the main project file accordingly, if nothing this allows us to check which versions we are working with quickly.

We will likely need to add more Python dependencies as the project grows in size, depedencies are managed in the `setup.cfg` file. My initial commit includes basic packages, but to add more packages simply add the names in the 'install_requires' sections as needed.
