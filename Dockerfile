FROM alpine:latest

RUN apk update
RUN apk upgrade
RUN apk add --no-cache bash curl git jq

COPY scripts/ /opt/resource/
RUN chmod +x /opt/resource/*
