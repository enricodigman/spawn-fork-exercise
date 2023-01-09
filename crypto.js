import crypto from 'node:crypto'

export function encrypt(publicKey, content) {
  const encrypted = crypto.publicEncrypt(publicKey, content)
  return encrypted
}

export function decrypt(privateKey, content, secret) {
  const decrypted = crypto.privateDecrypt({
    key: privateKey,
    passphrase: secret,
  }, content)

  return decrypted.toString()
}

export function verify(algo, data, publicKey, signature) {
  const result = crypto.verify(algo, data, publicKey, signature)
  return result
}
