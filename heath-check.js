// since we expect to run in docker swarm, the ip that is written to torrc may not always be active or where our server is actually running
// to deal with the above, this script will look up the service's ip and ping it as our docker uses it for the HEALTHCHECK
const fs = require('fs')
const http = require('http')

const torrc = fs.readFileSync('./torrc').toString()
const address = torrc
  .split('\n')
  .filter(s => s.startsWith('HiddenServicePort'))[0]
  .split(' ')
  .filter(s => s.indexOf(':') > 0)[0]

http.get('http://' + address + '/ping', {}, res => {
  const { statusCode } = res
  if (statusCode > 299) {
    throw new Error(
      'health check failed for downstream hidden service: HTTP ' + statusCode
    )
  }
})
console.log(address)
