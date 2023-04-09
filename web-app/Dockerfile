FROM node:19-buster-slim

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "serve", "-s", "build" ]
