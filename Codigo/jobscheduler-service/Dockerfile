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

# To wait for the database to be ready
RUN chmod +x /usr/src/gitgrade/jobscheduler_service/wait-for-it.sh
