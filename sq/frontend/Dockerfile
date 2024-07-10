FROM node:lts

ADD . /frontend

WORKDIR /frontend

RUN npm install

EXPOSE 5000
CMD ["npm", "run", "dev"]
