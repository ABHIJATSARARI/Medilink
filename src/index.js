// index.js
// The main entry point for the project

// Import the required modules
const express = require("express");
const cors = require("cors");
const blockchain = require("./blockchain");
const pangea = require("./pangea");
const config = require("./config");

// Initialize the blockchain and Pangea instances
const ledger = new blockchain.Ledger(config.blockchainNetwork);
const pangeaClient = new pangea.Client(config.pangeaApiKey);

// Create an express app and enable cors
const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// Define the API endpoints
app.get("/", (req, res) => {
  // Return a welcome message
  res.send("Welcome to MediLink: A Transparent and Accessible Medical Records Network");
});

app.post("/createRecord", async (req, res) => {
  // Create a new medical record on the blockchain and Pangea
  try {
    // Validate the request body
    const { patientId, providerId, recordData } = req.body;
    if (!patientId || !providerId || !recordData) {
      return res.status(400).send("Missing required parameters");
    }

    // Encrypt the record data using the encryption key
    const encryptedData = blockchain.encryptData(recordData, config.encryptionKey);

    // Create a new record on the blockchain and get its hash
    const recordHash = await ledger.createRecord(patientId, providerId, encryptedData);

    // Create a new record on Pangea and get its id
    const recordId = await pangeaClient.createRecord(patientId, providerId, recordHash);

    // Return a success message with the record id and hash
    res.status(201).send(`Record created successfully with id ${recordId} and hash ${recordHash}`);
  } catch (error) {
    // Handle any errors and return an error message
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.get("/readRecord/:id", async (req, res) => {
  // Read an existing medical record from the blockchain and Pangea
  try {
    // Validate the request parameter
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Missing required parameter");
    }

    // Get the record from Pangea by its id
    const record = await pangeaClient.readRecord(id);

    // Get the record data from the blockchain by its hash
    const recordData = await ledger.readRecord(record.hash);

    // Decrypt the record data using the encryption key
    const decryptedData = blockchain.decryptData(recordData, config.encryptionKey);

    // Return a success message with the record details and data
    res.status(200).send(`Record retrieved successfully with details: ${JSON.stringify(record)} and data: ${JSON.stringify(decryptedData)}`);
  } catch (error) {
    // Handle any errors and return an error message
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.put("/updateRecord/:id", async (req, res) => {
  // Update an existing medical record on the blockchain and Pangea
  try {
    // Validate the request parameter and body
    const { id } = req.params;
    const { recordData } = req.body;
    if (!id || !recordData) {
      return res.status(400).send("Missing required parameters");
    }

    // Encrypt the record data using the encryption key
    const encryptedData = blockchain.encryptData(recordData, config.encryptionKey);

    // Update the record on the blockchain and get its new hash
    const newHash = await ledger.updateRecord(id, encryptedData);

    // Update the record on Pangea and get its new id
    const newId = await pangeaClient.updateRecord(id, newHash);

    // Return a success message with the new id and hash
    res.status(200).send(`Record updated successfully with new id ${newId} and new hash ${newHash}`);
  } catch (error) {
    // Handle any errors and return an error message
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.post("/verifyRecord/:id", async (req, res) => {
  // Verify the authenticity of a medical record on the blockchain and Pangea
  try {
     // Validate the request parameter and body
     const { id } = req.params;
     const { verificationRequest } = req.body;
     if (!id || !verificationRequest) {
       return res.status(400).send("Missing required parameters");
     }

     // Get the record from Pangea by its id
     const record = await pangeaClient.readRecord(id);

     // Get the record data from the blockchain by its hash
     const recordData = await ledger.readRecord(record.hash);

     // Decrypt the record data using the encryption key
     const decryptedData = blockchain.decryptData(recordData, config.encryptionKey);

     // Compare the verification request with the decrypted data
     const isVerified = blockchain.compareData(verificationRequest, decryptedData);

     // Return a success message with the verification result
     res.status(200).send(`Record verification completed with result: ${isVerified}`);
  } catch (error) {
    // Handle any errors and return an error message
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// Start the server and listen on the port
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
