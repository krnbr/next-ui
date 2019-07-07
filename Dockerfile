FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN ls -lrt

COPY . .
RUN npm run build
RUN ls -lrt

CMD [ "npm", "run", "start-server-side" ]
