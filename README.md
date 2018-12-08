# dockerswarm-hidden-service (work in progress)

[](https://hub.docker.com/r/nexusuw/dockerswarm-hidden-service/)

## what is this
docker image for hosting a tor hidden service on docker swarm

## why is does this need to exist
the normal tor program expects direct tcp connections to the services you want to host as hidden services (aka .onion). these require IP address, and not hostnames. normally, I have used the docker swarm provided hostnames for linking my services together, but this will not work in a docker swarm.

## how does this whole thing work
### index.js
look up internal IP address of docker container, write that to the torrc (tor config file), and start up tor process

### health-check.js
keep pinging the IP. if the service moves to a new IP, this will mark the container as unhealthy, causing docker to restart it. thus, it will look up the IP of the new service location.
(note: boot times can be long since it currently needs to get all the tor network info each time on boot)

## how do I use this?
I use the following docker-compose.yml and a pre-generated hidden service private key at ```./private_key```
```
version: '3.6'
services:
  # currently service MUST BE NAMED 'caddy' and expect connections on port 80
  caddy: 
    <stuff>
  hidden:
    image: nexusuw/dockerswarm-hidden-service:latest
    secrets:
      - source: private_key
        target: '/var/lib/tor/hidden_service/private_key'
        uid: '100'
        gid: '100'
        mod: 600
secrets:
  private_key:
    file: ./private_key

```

## todo
- properly use volumes to preserve tor network state
- let people use their own name for service being hosted
- allow multiple services
- load balancer for multi tor connections?
- generate private keys on demand
