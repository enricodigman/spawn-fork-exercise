import { encrypt } from './helper.js'

process.stdin.on('data', (data) => {
  try {
    const { publicKey, fileContent } = JSON.parse(data.toString())
    process.stdout.write(encrypt(publicKey, fileContent))
  } catch (err) {
    console.error(err.toString())
  }
})
