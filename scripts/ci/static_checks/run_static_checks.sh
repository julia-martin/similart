#!/bin/bash

if [[ -f "${BUILD_CACHE_DIR}/.skip_tests" ]]; then
    echo
    echo "Skip tests"
    echo
    exit
fi

if [[ $# == "0" ]]; then
    pre-commit run --all-files --show-diff-on-failure --color always
else
    for pre_commit_check in "${@}"
    do
        pre-commit run "${pre_commit_check}" --all-files --show-diff-on-failure --color always
    done
fi