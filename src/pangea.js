// pangea.js
// The functions for interacting with the Pangea APIs

// Import the required modules
const axios = require("axios");
const config = require("./config");

// Define the Pangea API base URL
const pangeaApiUrl = "https://api.pangea.com/v1";

// Create a class for the client
class Client {
  constructor(apiKey) {
    // Initialize the axios instance with the API key
    this.axios = axios.create({
      baseURL: pangeaApiUrl,
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
  }

  async createRecord(patientId, providerId, recordHash) {
    // Create a new record on Pangea and return its id
    try {
      // Define the record data
      const recordData = {
        patientId,
        providerId,
        hash: recordHash
      };

      // Post the record data to the records endpoint and get the response
      const response = await this.axios.post("/records", recordData);

      // Get the record id from the response data
      const recordId = response.data.id;

      // Return the record id
      return recordId;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  async readRecord(recordId) {
    // Read an existing record from Pangea and return its details
    try {
      // Get the record details from the records endpoint by its id and get the response
      const response = await this.axios.get(`/records/${recordId}`);

      // Get the record details from the response data
      const recordDetails = response.data;

      // Return the record details
      return recordDetails;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }

  async updateRecord(recordId, newHash) {
    // Update an existing record on Pangea and return its new id
    try {
      // Define the new hash data
      const newHashData = {
        hash: newHash
      };

      // Put the new hash data to the records endpoint by its id and get the response
      const response = await this.axios.put(`/records/${recordId}`, newHashData);

      // Get the new record id from the response data
      const newId = response.data.id;

      // Return the new id
      return newId;
    } catch (error) {
      // Handle any errors and rethrow them
      console.error(error);
      throw error;
    }
  }
}

// Export the client class
module.exports = {
  Client
};
