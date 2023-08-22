FROM node:18-alpine3.17

# create destination directory
RUN mkdir -p /usr/src/gitgrade/jobscheduler_service
WORKDIR /usr/src/gitgrade/jobscheduler_service

# Update and install dependency
RUN apk update && \
    apk upgrade && \
    apk add --no-cache git bash inotify-tools

# Install app dependencies
COPY ./package.json .
RUN npm install

# Bundle app source
COPY . .

# To await for the database to be ready
COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh
