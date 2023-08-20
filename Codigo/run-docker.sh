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

get_env_suffix() {
    case "$1" in
        -dev) echo "development" ;;
        -test) echo "test" ;;
        -prod) echo "production" ;;
        *) echo "Usage: $0 {-dev|-test|-prod} [--branch branchName] [--d]"; exit 1 ;;
    esac
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

get_valid_directories() {
    directories=("./jobscheduler-service/env" "./supportplatform-service/env" "./supportplatform-web/env")
    valid_dirs=()

    for dir in "${directories[@]}"; do
        if [ -d "$dir" ] && { find "$dir" -type f -name "*.env" -print -quit | grep -q . ; } || \
                          { find "$dir" -type f -name "*.env.$1" -print -quit | grep -q . ; }; then
            valid_dirs+=("$dir")
        fi
    done

    echo "${valid_dirs[@]}"
}

build_docker_command() {
    BRANCH="$1"
    ENV_SUFFIX="$2"
    DETACHED="$3"
    VALID_DIRS=("$@")

    cmd="docker-compose -p gitgrade_$BRANCH"
    
    for dir in "${VALID_DIRS[@]:3}"; do
        for file in $(find "$dir" -type f -name "*.env"); do
            cmd="$cmd --env-file $file"
        done
        for specific in $(find "$dir" -type f -name "*.env.$ENV_SUFFIX"); do
            cmd="$cmd --env-file $specific"
        done
    done

    cmd="$cmd up $DETACHED"
    echo "$cmd"
}

check_git_installed
BRANCH_NAME=$(sanitize_branch_name $(get_branch_name "$@"))
trap 'handle_interrupt' INT
ENV_SUFFIX=$(get_env_suffix "$1")
DETACHED=$(check_detached_mode "$@")
VALID_DIRS=($(get_valid_directories "$ENV_SUFFIX"))
CMD=$(build_docker_command "$BRANCH_NAME" "$ENV_SUFFIX" "$DETACHED" "${VALID_DIRS[@]}")

echo "Running: $CMD"
eval "$CMD"
