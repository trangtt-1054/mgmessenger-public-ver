FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /user/src/api

# copy package.json to /user/src/api
COPY package.json . 
COPY yarn.lock .

RUN yarn global add @nestjs/cli

# install all the dependencies that are inside of package.json with collaboration with yarn.lock inside node_modules in production ready
RUN yarn install --production=true

# install netcat to use custom script to wait for other kind of dockers or containers that are running, so we can put things in order, e.g we want mysql db to run first => then api server => then nginx
RUN apt-get -q update && apt-get -qy install netcat

# copy all the files to the WORKDIR folder
COPY . .

RUN yarn build

# entry point command once the container is started to run, -c means custom script
CMD ["sh", "-c", "yarn typeorm migration:run && yarn start:prod"]
