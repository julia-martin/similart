#!/usr/bin/env bash

autoflake --imports=requests,boto3,sklearn,pandas,numpy --expand-star-imports --in-place "$@"