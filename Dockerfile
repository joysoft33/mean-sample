FROM node:7-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN npm -q install
RUN npm -q run build:prod

EXPOSE 8080
CMD [ "npm", "run", "production" ]