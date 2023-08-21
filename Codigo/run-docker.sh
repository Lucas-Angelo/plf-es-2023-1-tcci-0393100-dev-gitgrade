#!/bin/bash

set -e  # Pare o script na primeira falha

check_git_installed() {
    if ! [ -x "$(command -v git)" ]; then
        echo 'Error: git is not installed.' >&2
        exit 1
    fi
}

get_branch_name() {
    for arg in "$@"; do
        shift
        if [[ "$arg" == "--branch" ]]; then
            echo "$1"
            return
        fi
    done

    if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        echo "Error: This is not a git directory and branch name was not provided." >&2
        exit 1
    fi

    BRANCH_NAME=$(git symbolic-ref HEAD --short 2>/dev/null) || \
        BRANCH_NAME=$(git branch -a --contains HEAD | sed -n 2p | awk '{ printf $1 }' | sed 's#remotes/origin/##')

    echo "$BRANCH_NAME"
}

sanitize_branch_name() {
    echo "$1" | tr '/' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_-]//g'
}

handle_interrupt() {
    echo "Stopping..."
    kill -- -$$
    exit
}

check_detached_mode() {
    for arg in "$@"; do
        if [[ "$arg" == "--d" ]]; then
            echo "-d"
            return
        fi
    done
    echo ""
}

build_docker_command() {
    BRANCH="$1"
    DETACHED="$2"
    
    cmd="docker-compose --env-file .env -p gitgrade_$BRANCH up $DETACHED"
    echo "$cmd"
}

check_git_installed
BRANCH_NAME=$(sanitize_branch_name $(get_branch_name "$@"))
trap 'handle_interrupt' INT
DETACHED=$(check_detached_mode "$@")
CMD=$(build_docker_command "$BRANCH_NAME" "$DETACHED")

echo "Running: $CMD"
eval "$CMD"
