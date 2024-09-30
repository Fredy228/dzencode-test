FROM node:lts

RUN npm install -g nodemon

RUN npm install -g nestjs

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}


