#!/usr/bin/env bash

flake8 --config "$( dirname "${BASH_SOURCE[0]}" )"/../../../.flake8 "$@"