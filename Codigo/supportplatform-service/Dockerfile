# Base image
FROM node:18-alpine3.17

# create destination directories
RUN mkdir -p /usr/src/gitgrade/supportplatform_service
RUN mkdir -p /usr/src/gitgrade/dtos-lib

# Set working directories
WORKDIR /usr/src/gitgrade/

# Update and install dependency
RUN apk update && \
    apk upgrade && \
    apk add --no-cache git bash inotify-tools tzdata

# Set timezone
RUN ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone

# Copy dtos-lib and install its dependencies
COPY ./dtos-lib ./dtos-lib
WORKDIR /usr/src/gitgrade/dtos-lib
RUN npm install

# Move back to supportplatform_service for further setup
WORKDIR /usr/src/gitgrade/supportplatform_service

# Copy package.json and install its dependencies for supportplatform_service
COPY ./supportplatform-service/ .
RUN npm install

# To await for the database to be ready
RUN chmod +x ./wait-for-it.sh
