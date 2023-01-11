import { encrypt } from './helper.js'

process.on('message', (data) => {
  try {
    const { publicKey, fileContent } = data
    process.send(encrypt(publicKey, fileContent))
  } catch (err) {
    console.error(err.toString())
    process.exit(1)
  }
})
