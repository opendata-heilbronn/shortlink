FROM node:10
WORKDIR /usr/src/app
ADD package.json .
ADD dist .
RUN npm install --production
CMD ["node", "index.js"]