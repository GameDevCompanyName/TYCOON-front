FROM node:12

# создание директории приложения
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

WORKDIR /app/server

RUN npm install
EXPOSE 80

CMD [ "node", "server.js" ]
