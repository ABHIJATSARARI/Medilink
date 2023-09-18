// provider.js
// The schema definition for a provider model

// Import mongoose
const mongoose = require("mongoose");

// Define the provider schema
const providerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  institutionName: {
    type: String,
    required: true
  },
  institutionAddress: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

// Export the provider model
module.exports = mongoose.model("Provider", providerSchema);
