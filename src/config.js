// config.js
// The configuration variables for the project

module.exports = {
    port: process.env.PORT || 8000, // The port number for the server
    blockchainNetwork: process.env.BLOCKCHAIN_NETWORK || "http://localhost:8545", // The blockchain network address
    pangeaApiKey: process.env.PANGEA_API_KEY || "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // The Pangea API key
    encryptionKey: process.env.ENCRYPTION_KEY || "medilink" // The encryption key for the record data
  };
  