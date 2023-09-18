// blockchain.js
// The functions for interacting with the blockchain ledger

// Import the required modules
const Web3 = require("web3");
const crypto = require("crypto");

// Define the record contract ABI and address
const recordContractAbi = [
  // The contract ABI goes here
];
const recordContractAddress = "0x0000000000000000000000000000000000000000"; // The contract address goes here

// Create a class for the ledger
class Ledger {
  constructor(network) {
    // Initialize the web3 instance and the contract instance
    this.web3 = new Web3(new Web3.providers.HttpProvider(network));
    this.contract = new this.web3.eth.Contract(recordContractAbi, recordContractAddress);
  }

  async createRecord(patientId, providerId, encryptedData) {
    // Create a new record on the ledger and return its hash
    try {
      // Get the default account from the web3 instance
      const account = await this.web3.eth.getAccounts()[0];

      // Call the createRecord function from the contract and get the transaction receipt
      const receipt = await this.contract.methods.createRecord(patientId, providerId, encryptedData).send({ from: account });

      // Get the record hash from the transaction logs
      const recordHash = receipt.events.RecordCreated.returnValues.recordHash;

      // Return the record hash
      return recordHash;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  async readRecord(recordHash) {
    // Read an existing record from the ledger and return its data
    try {
      // Call the readRecord function from the contract and get the record data
      const recordData = await this.contract.methods.readRecord(recordHash).call();

      // Return the record data
      return recordData;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  async updateRecord(recordId, encryptedData) {
    // Update an existing record on the ledger and return its new hash
    try {
      // Get the default account from the web3 instance
      const account = await this.web3.eth.getAccounts()[0];

      // Call the updateRecord function from the contract and get the transaction receipt
      const receipt = await this.contract.methods.updateRecord(recordId, encryptedData).send({ from: account });

      // Get the new record hash from the transaction logs
      const newHash = receipt.events.RecordUpdated.returnValues.newHash;

      // Return the new hash
      return newHash;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  static encryptData(data, key) {
    // Encrypt some data using a key and return a hex string
    try {
      // Create a cipher object with aes-256-cbc algorithm and a random initialization vector
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      // Encrypt the data and append the iv to it
      const encrypted = Buffer.concat([cipher.update(data), cipher.final(), iv]);

      // Return a hex string of the encrypted data
      return encrypted.toString("hex");
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  static decryptData(data, key) {
    // Decrypt some data using a key and return a JSON object
    try {
      // Convert the data from hex to buffer and extract the iv from it
      const buffer = Buffer.from(data, "hex");
      const iv = buffer.slice(buffer.length - 16);
      
      // Create a decipher object with aes-256-cbc algorithm and the extracted iv 
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

       // Decrypt the data and parse it as JSON 
       const decrypted = Buffer.concat([decipher.update(buffer.slice(0, buffer.length - 16)), decipher.final()]);
       const json = JSON.parse(decrypted.toString());

       // Return the JSON object
       return json;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  static compareData(request, data) {
    // Compare a verification request with some decrypted data and return a boolean
    try {
      // Convert the request and data to strings
      const requestString = JSON.stringify(request);
      const dataString = JSON.stringify(data);

      // Compare the strings and return the result
      return requestString === dataString;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }
}

// Export the ledger class
module.exports = {
  Ledger
};
