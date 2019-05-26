FROM node:10

COPY config /config
COPY dist /dist
COPY next.config.js /
COPY package.json /
COPY package-lock.json /

RUN npm run deps:production

ENV NODE_ENV production

ENV PORT 80
EXPOSE 80

CMD npm start