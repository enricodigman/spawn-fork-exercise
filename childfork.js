import * as dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { encrypt } from './crypto.js'

dotenv.config()

process.on('message', (data) => {
  try {
    const { pubKey, file } = JSON.parse(data.toString())
    const fileContent = readFileSync(file)
    process.send(encrypt(pubKey, fileContent))
  } catch (error) {
    console.log(error.toString())
  }
})
