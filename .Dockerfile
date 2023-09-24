# Node image based on Alpine Linux to keep the container as lightweight as possible
FROM node:18-alpine

# Install dependencies in container and copy application source code
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Application server will listen on this port
EXPOSE 3000

CMD [ "npm", "start" ]