FROM node:14
USER root
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY node_modules/discord.js /app/node_modules
COPY node_modules/winston-transport /app/node_modules
COPY node_modules/logform /app/node_modules
COPY node_modules/colors /app/node_modules
COPY node_modules/mongoose /app/node_modules
COPY . /app
# ENTRYPOINT ["./entrypoint.sh"]
RUN chmod +x /app/node_modules/.bin/nodemon
RUN npm install -g nodemon
EXPOSE 3000
CMD ["npm", "run", "start.dev"]