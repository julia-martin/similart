#!/usr/bin/env bash

# shellcheck source=scripts/ci/static_checks/autoflake.sh
. "$( dirname "${BASH_SOURCE[0]}" )/../static_checks/autoflake.sh" "${@}"
