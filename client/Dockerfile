FROM node:14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /user/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production=false

COPY . .

RUN yarn build

CMD ["yarn", "start"]