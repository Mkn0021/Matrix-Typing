// This file contains three word lists (short, medium, long) from the google-10000-english list.
// Source: https://github.com/first20hours/google-10000-english
// Short: 1-4 chars, Medium: 5-8 chars, Long: 9+ chars

// Cybersecurity/matrix-related words (prioritized at the top of each list)
const cyberShort = [
  "key", "bot", "net", "vpn", "cmd", "api", "mac", "ram", "ssl", "dns", "usb", "sql", "ssh", "hex", "tcp", "udp", "ip", "os", "gui", "cli", "bug", "app", "hub", "log", "web", "www", "lan", "wan", "dos", "mit", "xor", "aes", "rsa", "md5", "sha", "ssl", "tls", "mac", "vpn", "otp", "pin", "sim", "usb", "zip", "bin", "sys", "dev", "hex", "bit", "git", "hub", "api", "cmd", "bot", "net", "vpn", "ram", "mac", "dns", "usb", "sql", "ssh", "hex", "tcp", "udp", "ip", "os", "gui", "cli", "bug", "app", "hub", "log", "web", "www", "lan", "wan", "dos", "mit", "xor", "aes", "rsa", "md5", "sha", "ssl", "tls", "mac", "vpn", "otp", "pin", "sim", "usb", "zip", "bin", "sys", "dev", "hex", "bit", "git", "hub", "api", "cmd"
]

const cyberMedium = [
  "matrix", "cyber", "secure", "attack", "threat", "malware", "phishing", "firewall", "exploit", "payload", "session", "sandbox", "monitor", "scanner", "network", "gateway", "router", "console", "command", "process", "virtual", "browser", "cookie", "session", "control", "access", "account", "encrypt", "decrypt", "hashing", "spoof", "packet", "payload", "session", "sandbox", "monitor", "scanner", "network", "gateway", "router", "console", "command", "process", "virtual", "browser", "cookie", "session", "control", "access", "account", "encrypt", "decrypt", "hashing", "spoof", "packet", "payload", "session", "sandbox", "monitor", "scanner", "network", "gateway", "router", "console", "command", "process", "virtual", "browser", "cookie", "session", "control", "access", "account", "encrypt", "decrypt", "hashing", "spoof", "packet"
]

const cyberLong = [
  "authentication", "authorization", "cryptography", "vulnerability", "configuration", "penetration", "administrator", "implementation", "confidentiality", "availability", "integrity", "vulnerability", "cryptanalysis", "decryption", "encryption", "firewalling", "virtualization", "infrastructure", "cybersecurity", "multifactor", "surveillance", "countermeasure", "reconnaissance", "privilege", "exploitation", "vulnerability", "cryptanalysis", "decryption", "encryption", "firewalling", "virtualization", "infrastructure", "cybersecurity", "multifactor", "surveillance", "countermeasure", "reconnaissance", "privilege", "exploitation"
]

// import googleWords from "./google-10000-english.txt?raw";
// const allWords = googleWords.split("\n").map((w: string) => w.trim()).filter((w: string) => Boolean(w));

export const shortWords = [
  ...cyberShort,
//   ...allWords.filter((w: string) => w.length >= 1 && w.length <= 4 && !cyberShort.includes(w))
].slice(0, 600);

export const mediumWords = [
  ...cyberMedium,
//   ...allWords.filter((w: string) => w.length >= 5 && w.length <= 8 && !cyberMedium.includes(w))
].slice(0, 900);

export const longWords = [
  ...cyberLong,
//   ...allWords.filter((w: string) => w.length >= 9 && !cyberLong.includes(w))
].slice(0, 500);
