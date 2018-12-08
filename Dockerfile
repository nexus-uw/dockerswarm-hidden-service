FROM node:10-alpine

RUN apk --no-cache add tor
RUN addgroup -S tor && adduser tor tor
WORKDIR /build

COPY *.js /build/

#VOLUME /etc/tor
#VOLUME /var/lib/tor/hidden_service

RUN  chown -R tor:tor /build && \
     mkdir -p /var/lib/tor/hidden_service && \
     chown -R tor:tor /var/lib/tor/hidden_service && \
     chmod 700 /var/lib/tor/hidden_service 

USER tor
HEALTHCHECK CMD node health-check.js
CMD ["node", "index.js"]
