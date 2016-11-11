FROM alpine:latest

RUN apk add --no-cache bash curl git jq

COPY bin/ /opt/resource/
RUN chmod +x /opt/resource/*
