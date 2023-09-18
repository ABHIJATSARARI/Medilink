// record.js
// The schema definition for a record model

// Import mongoose
const mongoose = require("mongoose");

// Define the record schema
const recordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  providerId: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Export the record model
module.exports = mongoose.model("Record", recordSchema);
