import * as dotenv from 'dotenv'
import { fork } from 'node:child_process'
import { sign } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { freemem } from 'node:os'
import { generateKeys, validate, decrypt } from './helper.js'

const startMem = freemem()
dotenv.config()

try {
  const { publicKey, privateKey } = generateKeys(process.env.SECRET)

  const child = fork('./childfork.js')
  const fileContent = readFileSync('./sampleFile.txt', 'utf-8')
  const signature = sign('SHA256', fileContent, { key: privateKey, passphrase: process.env.SECRET })

  process.on('exit', () => {
    child.kill()
  })
  child.on('message', (data) => {
    try {
      const decryptedFile = decrypt(privateKey, Buffer.from(data), process.env.SECRET)
      const validation = validate('SHA256', decryptedFile, publicKey, signature) ? decryptedFile.toString() : 'Invalid Message'
      console.table([{
        message: validation,
        timeConsumed: process.uptime(),
        memoryConsumed: `${(startMem - freemem()) / 1048576} mb`,
      }])
      child.kill()
    } catch (err) {
      console.log(err.toString())
      process.exit(1)
    }
  })
  child.on('error', (err) => {
    console.log(err.toString())
    process.exit(1)
  })
  child.send({
    publicKey,
    fileContent,
  })
} catch (err) {
  console.log(err.toString())
  process.exit(1)
}
