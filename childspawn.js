import { readFileSync, writeFileSync } from 'node:fs'
import { encrypt } from './helper.js'

process.stdin.on('data', (data) => {
  try {
    const { publicKey, file } = JSON.parse(data.toString())
    const fileContent = readFileSync(file)
    const encryptedContent = encrypt(publicKey, fileContent)
    writeFileSync('./encrypted.txt', encryptedContent)
    process.stdout.write('./encrypted.txt')
  } catch (err) {
    console.error(err.toString())
  }
})
