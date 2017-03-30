FROM node:alpine
MAINTAINER Ehsan Asdar <easdar@gatech.edu>

# Deis wants bash
RUN apk update && apk add bash
RUN apk add git

# Bundle app source
WORKDIR /usr/src/metrics
COPY . /usr/src/metrics
RUN npm install

# Deis wants EXPOSE and CMD
EXPOSE 3000
CMD ["node", "index.js"]
