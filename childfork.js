import { readFileSync, writeFileSync } from 'node:fs'
import { encrypt } from './helper.js'

process.on('message', (data) => {
  try {
    const { publicKey, file } = data
    const fileContent = readFileSync(file)
    const encryptedContent = encrypt(publicKey, fileContent)
    writeFileSync('./encrypted.txt', encryptedContent)
    process.send('./encrypted.txt')
  } catch (err) {
    console.error(err.toString())
    process.exit(1)
  }
})
