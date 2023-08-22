#!/bin/bash

set -e  # Stop the script on the first failure

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
        echo "Error: This is not a git directory and no branch name was provided." >&2
        exit 1
    fi

    BRANCH_NAME=$(git symbolic-ref HEAD --short 2>/dev/null) || \
        BRANCH_NAME=$(git branch -a --contains HEAD | sed -n 2p | awk '{ printf $1 }' | sed 's#remotes/origin/##')

    echo "$BRANCH_NAME"
}

clean_branch_name() {
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
    
    # Stop and remove containers with the prefix gitgrade_$BRANCH
    docker ps -a | grep "gitgrade_$BRANCH" | awk '{print $1}' | xargs -r docker stop > /dev/null 2>&1
    docker ps -a | grep "gitgrade_$BRANCH" | awk '{print $1}' | xargs -r docker rm > /dev/null 2>&1
    
    # Remove images with the prefix gitgrade_$BRANCH
    docker images | grep "gitgrade_$BRANCH" | awk '{print $3}' | xargs -r docker rmi > /dev/null 2>&1
        
    # Remove volumes with the prefix gitgrade_$BRANCH
    docker volume ls | grep "gitgrade_$BRANCH" | awk '{print $2}' | xargs -r docker volume rm > /dev/null 2>&1
        
    # Remove networks with the prefix gitgrade_$BRANCH
    docker network ls | grep "gitgrade_$BRANCH" | awk '{print $2}' | xargs -r docker network rm > /dev/null 2>&1
    
    # Prune to clean up all unused resources
    docker system prune -f > /dev/null 2>&1
    docker volume prune -f > /dev/null 2>&1
    docker network prune -f > /dev/null 2>&1
    
    # Define the requested command
    cmd="docker-compose -p gitgrade_$BRANCH up $DETACHED"
    
    printf "$cmd"
}

check_git_installed
BRANCH_NAME=$(clean_branch_name $(get_branch_name "$@"))
trap 'handle_interrupt' INT
DETACHED=$(check_detached_mode "$@")
CMD=$(build_docker_command "$BRANCH_NAME" "$DETACHED")

echo "Running: $CMD"
eval "$CMD"
