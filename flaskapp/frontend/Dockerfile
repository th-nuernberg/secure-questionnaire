FROM node:lts-alpine

# install project dependencies
RUN npm install -g @vue/cli

WORKDIR /app
# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . /frontend
COPY . .

# vue ui --headless --port 8000 --host 0.0.0.0
#CMD [ "vue", "ui", "--headless" , "--port", "8000",  "--host", "0.0.0.0" ]
# CMD [ "npm", "run", "serve", "--host", "0.0.0.0" ]

#FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install

ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build
COPY . .
CMD ["npm", "run", "serve", "--", "--port", "5000"]
