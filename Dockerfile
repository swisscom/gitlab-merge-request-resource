FROM alpine:latest

RUN apk add --no-cache bash curl git jq nodejs

COPY scripts/ /opt/resource/
RUN chmod +x /opt/resource/*

WORKDIR /opt/resource
COPY package.json /opt/resource/
RUN npm install --silent
