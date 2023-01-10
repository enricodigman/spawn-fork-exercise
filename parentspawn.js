import * as dotenv from 'dotenv'
import { spawn } from 'node:child_process'
import { sign } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { generateKeys, validate, decrypt } from './helper.js'

dotenv.config()

try {
  const { publicKey, privateKey } = generateKeys(process.env.SECRET)

  const child = spawn('node', ['./childspawn.js'])

  const sig = sign('SHA256', readFileSync('./sampleFile.txt'), { key: privateKey, passphrase: process.env.SECRET })
  child.stdin.write(JSON.stringify({
    pubKey: publicKey,
    file: './sampleFile.txt',
  }))

  child.stdout.on('data', (data) => {
    const decryptedFile = decrypt(privateKey, Buffer.from(data.toString(), 'base64'), process.env.SECRET)
    const validation = validate('SHA256', decryptedFile, publicKey, sig) ? decryptedFile.toString() : 'Invalid Message'
    console.log(`Text: ${validation}`)
    console.log(`Time Consumed: ${process.uptime()}`)
    console.log(`Memory Consumed: ${process.memoryUsage().external}`)
    process.exit(0)
  })

  child.stderr.on('data', (error) => {
    console.log(error.toString())
  })

  child.on('error', (error) => {
    console.log(error.toString())
  })
} catch (error) {
  console.log(error.toString())
}
