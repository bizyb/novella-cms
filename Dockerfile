FROM node:alpine
RUN apk update
RUN apk add git

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

COPY ./package*.json ./

RUN npm install --legacy-peer-deps

COPY ./ ./

RUN npm run build
EXPOSE 3000
USER node
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]


