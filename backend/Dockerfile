# get the base image
FROM node:20-alpine

# set the working directory
WORKDIR /app

# copy the package.json file
COPY package*.json ./

# install the dependencies
RUN npm install

# copy the source code
COPY . .

# expose the port
EXPOSE 5000

# start the application
CMD ["npm", "run", "dev"]
FROM node:18-alpine

# set the working directory
WORKDIR /app

# copy the package.json file
COPY package*.json ./

# install the dependencies
RUN npm install && npm install -g nodemon

# copy the source code
COPY . .

# expose the port
EXPOSE 4000

# start the application
CMD ["node", "server.js"]