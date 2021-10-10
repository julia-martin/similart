#!/usr/bin/env bash

# shellcheck source=scripts/ci/static_checks/flake8.sh
. "$( dirname "${BASH_SOURCE[0]}" )/../static_checks/flake8.sh" "${@}"
