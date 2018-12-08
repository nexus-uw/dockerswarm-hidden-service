const dns = require('dns')
const fs = require('fs')
const { spawn } = require('child_process')
const options = {
  family: 4,
  // hints: dns.ADDRCONFIG | dns.V4MAPPED,
}
const service = 'caddy'
dns.lookup(service, options, (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family)
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (!address) {
    console.error(`ERROR: unable to find ip for ${service}`)
    process.exit(1)
  }
  const hiddenServiceDir = '/var/lib/tor/hidden_service'
  const file = `
SocksPort 0

HiddenServiceDir ${hiddenServiceDir}
HiddenServicePort 80 ${address}:80
`
  const path = './torrc'
  fs.writeFileSync(path, file)
  console.log(file)

  const ls = spawn('tor', ['-f', path])

  setTimeout(
    () =>
      console.log(
        'hidden service address: ' +
          fs.readFileSync(hiddenServiceDir + '/hostname')
      ),
    1500
  ) // hopefully it has been populated by now

  ls.stdout.on('data', data => {
    console.log(`${data}`)
  })

  ls.stderr.on('data', data => {
    console.log(`${data}`)
  })

  ls.on('close', code => {
    console.log(`child process exited with code ${code}`)
    process.exit(code)
  })
})
