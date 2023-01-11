import * as dotenv from 'dotenv'
import { spawn } from 'node:child_process'
import { sign } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { freemem } from 'node:os'
import { generateKeys, validate, decrypt } from './helper.js'

const startMem = freemem()
dotenv.config()

try {
  const { publicKey, privateKey } = generateKeys(process.env.SECRET)

  const child = spawn('node', ['./childspawn.js'])
  const fileContent = readFileSync('./sampleFile.txt', 'utf-8')
  const signature = sign('SHA256', fileContent, { key: privateKey, passphrase: process.env.SECRET })

  child.stdout.on('data', (data) => {
    try {
      const decryptedFile = decrypt(privateKey, data, process.env.SECRET)
      const validation = validate('SHA256', decryptedFile, publicKey, signature) ? decryptedFile.toString() : 'Invalid Message'
      console.table([{
        message: validation,
        timeConsumed: process.uptime(),
        memoryConsumed: `${(startMem - freemem()) / 1048576} mb`,
      }])
      child.kill()
    } catch (err) {
      console.log(err.toString())
      child.kill()
    }
  })
  child.stderr.on('data', (err) => {
    console.log(err.toString())
    child.kill()
  })
  child.on('error', (err) => {
    console.log(err)
    child.kill()
  })
  child.stdin.write(JSON.stringify({
    publicKey,
    fileContent,
  }))
} catch (err) {
  console.log(err.toString())
  process.exit(1)
}
