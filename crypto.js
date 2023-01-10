import { publicEncrypt, privateDecrypt, verify } from 'node:crypto'

export function encrypt(publicKey, content) {
  const encrypted = publicEncrypt(publicKey, content)
  return encrypted
}

export function decrypt(privateKey, content, secret) {
  const decrypted = privateDecrypt({
    key: privateKey,
    passphrase: secret,
  }, content)

  return decrypted.toString()
}

export function validate(algo, data, publicKey, signature) {
  const result = verify(algo, data, publicKey, signature)
  return result
}
