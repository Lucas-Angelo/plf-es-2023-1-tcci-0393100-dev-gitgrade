# Base image
FROM node:18-buster

# Update and install dependencies
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y git bash inotify-tools tzdata

# Set timezone
RUN ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
  echo "America/Sao_Paulo" > /etc/timezone

# Create destination directories
RUN mkdir -p /usr/src/gitgrade/supportplatform_service
RUN mkdir -p /usr/src/gitgrade/dtos-lib

# Set working directories
WORKDIR /usr/src/gitgrade/

# Copy dtos-lib files
COPY ./dtos-lib ./dtos-lib/

# Copy supportplatform_service files
COPY ./supportplatform-service/ ./supportplatform_service/

# Install dtos-lib dependencies
WORKDIR /usr/src/gitgrade/dtos-lib
RUN npm install

# Install supportplatform_service dependencies
WORKDIR /usr/src/gitgrade/supportplatform_service
RUN npm install

# To await for the database to be ready
RUN chmod +x ./wait-for-it.sh
