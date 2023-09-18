// utils.js
// Some utility functions for the project

// Import the required modules
const crypto = require("crypto");

// Define a function to generate a unique identifier for a patient or a provider
function generateUniqueId() {
  // Use crypto to generate a random string of 16 bytes and return it as hex
  return crypto.randomBytes(16).toString("hex");
}

// Define a function to validate an input as a JSON object
function validateJson(input) {
  // Try to parse the input as JSON and return true if successful, false otherwise
  try {
    JSON.parse(input);
    return true;
  } catch (error) {
    return false;
  }
}

// Export the utility functions
module.exports = {
  generateUniqueId,
  validateJson
};
