FROM node:12

# создание директории приложения
WORKDIR /app

COPY ./server ./server
COPY ./public ./public

WORKDIR /app/server

RUN npm install
EXPOSE 80

CMD [ "node", "start" ]
