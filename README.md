# Getting start

1. Clone repository
 ```bash
$ git clone ...
$ cd dzencode-test
```

2. Rename `.env.example` to `.env`

3. Start project
 ```bash
# development
$ docker-compose build # build
$ docker-compose up -d # start

# production
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml build # build
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d # start
```

## Technology

- Nest.js
- TypeORM
- WebSocket
- RabbitMQ
- Redis
- PostgreSQL
- JWT
- React
- Docker

## Description
Приложение "Комментарии". Приложение в котором можно оставлять комментарии и отвечать другом пользователям. 
Также можно прикреплять файлы к своим сообщениям. Разработана полноценная авторизация/аунтификация пользователя для безопасности.
Добавлена фича, приходит уведомление на сайте когда ответили на ваш комментарий.
Так же реализована пагинация для по страничного просмотра сообщений.

PS. При первом запуске будет создаваться база данных, есть какой-то баг, после запуска проекта нужно перезагрузить еще раз контейнер main_server. Это из-за TypeORM - синхронизация, можно решить путем создания миграций, к сожалению не успел это сделать.
