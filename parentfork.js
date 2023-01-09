import * as dotenv from 'dotenv'
import crypto from 'node:crypto'
import { fork } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { verify, decrypt } from './crypto.js'
import generateKeys from './helper.js'

dotenv.config()

const { publicKey, privateKey } = generateKeys(process.env.SECRET)

const child = fork('./childfork.js')

const sig = crypto.sign('SHA256', readFileSync('./sampleFile.txt'), { key: privateKey, passphrase: process.env.SECRET })
const dataObj = {
  pubKey: publicKey,
  file: './sampleFile.txt',
}

child.send(JSON.stringify(dataObj))

child.on('message', (data) => {
  const decryptedFile = decrypt(privateKey, Buffer.from(data), process.env.SECRET)
  const validation = verify('SHA256', decryptedFile, publicKey, sig) ? decryptedFile : 'Invalid Message'
  console.table({
    time: process.uptime(),
    text: validation,
    heapUsed: process.memoryUsage().heapUsed,
  })
})
