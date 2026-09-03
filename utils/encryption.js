const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("ENCRYPTION_KEY is required to store user API keys.");
  }

  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string.");
  }
  return key;
}

function encrypt(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

function decrypt(cipherText) {
  const [ivHex, authTagHex, encryptedHex] = String(cipherText || "").split(":");
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Encrypted value is not in the expected format.");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  return (
    decipher.update(Buffer.from(encryptedHex, "hex"), undefined, "utf8") +
    decipher.final("utf8")
  );
}

module.exports = { encrypt, decrypt };
