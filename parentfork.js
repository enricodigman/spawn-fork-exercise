import * as dotenv from 'dotenv'
import { fork } from 'node:child_process'
import { sign } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { generateKeys, validate, decrypt } from './helper.js'

dotenv.config()

try {
  const { publicKey, privateKey } = generateKeys(process.env.SECRET)

  const child = fork('./childfork.js')

  const sig = sign('SHA256', readFileSync('./sampleFile.txt'), { key: privateKey, passphrase: process.env.SECRET })
  child.send(JSON.stringify({
    pubKey: publicKey,
    file: './sampleFile.txt',
  }))

  child.on('message', (data) => {
    const decryptedFile = decrypt(privateKey, Buffer.from(data.toString(), 'base64'), process.env.SECRET)
    const validation = validate('SHA256', decryptedFile, publicKey, sig) ? decryptedFile.toString() : 'Invalid Message'
    console.table([{
      text: validation,
      timeConsumed: process.uptime(),
      memoryUsed: process.memoryUsage().external,
    }])
    process.exit(0)
  })

  child.on('error', (error) => {
    console.log(error.toString())
  })
} catch (error) {
  console.log(error.toString())
}
