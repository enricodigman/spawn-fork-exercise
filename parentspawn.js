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
  const dataObj = {
    pubKey: publicKey,
    file: './sampleFile.txt',
  }

  child.stdin.write(JSON.stringify(dataObj))

  child.stdout.on('data', (data) => {
    const decryptedFile = decrypt(privateKey, Buffer.from(data.toString(), 'base64'), process.env.SECRET)
    const validation = validate('SHA256', decryptedFile, publicKey, sig) ? decryptedFile : 'Invalid Message'
    console.table([{
      text: validation,
      timeConsumed: process.uptime(),
      memoryUsed: process.memoryUsage().heapUsed,
    }])
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
