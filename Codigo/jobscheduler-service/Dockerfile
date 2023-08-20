FROM node:18-alpine3.17

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# create destination directory
RUN mkdir -p /usr/src/gitgrade/jobscheduler_service
WORKDIR /usr/src/gitgrade/jobscheduler_service

# Update and install dependency
RUN apk update && \
    apk upgrade && \
    apk add --no-cache git bash inotify-tools

# Install app dependencies
COPY ./package.json .
RUN npm install -g nodemon && \
    npm install

# Bundle app source
COPY . .

# Change ownership of the application directory to our appuser
RUN chown -R appuser:appgroup /usr/src/gitgrade/jobscheduler_service

# Wait for the database to be ready
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Switch to our new user
USER appuser
