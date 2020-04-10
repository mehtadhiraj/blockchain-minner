FROM node:10
# Create app directory
WORKDIR /usr/src/app/minner
# Install app dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .

#Start appliation
CMD [ "npm", "start" ]

