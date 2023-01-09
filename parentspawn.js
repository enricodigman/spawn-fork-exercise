import * as dotenv from 'dotenv'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { verify, decrypt } from './crypto.js'
import generateKeys from './helper.js'

dotenv.config()

const { publicKey, privateKey } = generateKeys(process.env.SECRET)

const child = spawn('node', ['./childspawn.js'])

const sig = crypto.sign('SHA256', readFileSync('./sampleFile.txt'), { key: privateKey, passphrase: process.env.SECRET })
const dataObj = {
  pubKey: publicKey,
  file: './sampleFile.txt',
}

child.stdin.write(JSON.stringify(dataObj))

child.stdout.on('data', (data) => {
  const decryptedFile = decrypt(privateKey, data, process.env.SECRET)
  const validation = verify('SHA256', decryptedFile, publicKey, sig) ? decryptedFile : 'Invalid Message'
  console.table({
    time: process.uptime(),
    text: validation,
    heapUsed: process.memoryUsage().heapUsed,
  })
})

child.stderr.on('data', (error) => {
  console.log(error.toString())
})
