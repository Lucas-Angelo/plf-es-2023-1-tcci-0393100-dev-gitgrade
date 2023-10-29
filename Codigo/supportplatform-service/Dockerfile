# Base image
FROM node:18-buster

# Update and install dependencies
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y git bash inotify-tools tzdata

# Install locales
RUN apt-get install -y locales
# Generate locale en_US.CP1252
RUN locale-gen en_US.CP1252
# Configure default locale
ENV LANG en_US.CP1252
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.CP1252

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
