import {
  publicEncrypt, privateDecrypt, verify, generateKeyPairSync,
} from 'node:crypto'

export function generateKeys(secret) {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: secret,
    },
  })

  return { publicKey, privateKey }
}

export function encrypt(publicKey, content) {
  const encrypted = publicEncrypt(publicKey, content)
  return encrypted
}

export function decrypt(privateKey, content, secret) {
  const decrypted = privateDecrypt({
    key: privateKey,
    passphrase: secret,
  }, content)

  return decrypted
}

export function validate(algo, data, publicKey, signature) {
  const result = verify(algo, data, publicKey, signature)
  return result
}
