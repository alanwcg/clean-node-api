FROM node:16

WORKDIR /usr/app/clean-node-api

COPY ./package.json ./

RUN npm set-script prepare "" && npm install --only=prod

COPY ./dist ./dist

EXPOSE 3333

CMD npm start