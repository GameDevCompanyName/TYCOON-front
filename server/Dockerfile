FROM node:12

# создание директории приложения
WORKDIR /app

COPY package*.json ./server/
COPY server.js ./server/
COPY ../public ./

WORKDIR /app/server

RUN npm install
EXPOSE 80

CMD [ "node", "start" ]
