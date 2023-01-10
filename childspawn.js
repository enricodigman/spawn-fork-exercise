import * as dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { encrypt } from './crypto.js'

dotenv.config()

process.stdin.on('data', (data) => {
  try {
    const { pubKey, file } = JSON.parse(data.toString())
    const fileContent = readFileSync(file)
    process.stdout.write(encrypt(pubKey, fileContent).toString('base64'))
  } catch (error) {
    console.log(error.toString())
  }
})
