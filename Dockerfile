# use a node base image
FROM node:16

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY . .
# set maintainer
LABEL maintainer "mehmuud.94@gmail.com"

# set a health check
HEALTHCHECK --interval=5s \
            --timeout=5s \
            CMD curl -f http://127.0.0.1:65530 || exit 1

# tell docker what port to expose
EXPOSE 65530

CMD ["node","server.js"]

