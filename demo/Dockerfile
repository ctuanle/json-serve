FROM node:16-alpine
WORKDIR /usr/src/app
RUN yarn global add @ctuanle/json-serve
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["jss", "./data.json", "8080", "--readonly"]