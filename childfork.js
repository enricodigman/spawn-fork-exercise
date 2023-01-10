import { readFileSync } from 'node:fs'
import { encrypt } from './helper.js'

process.on('message', (data) => {
  try {
    const { pubKey, file } = JSON.parse(data.toString())
    const fileContent = readFileSync(file)
    process.send(encrypt(pubKey, fileContent).toString('base64'))
  } catch (error) {
    console.log(error.toString())
  }
})
