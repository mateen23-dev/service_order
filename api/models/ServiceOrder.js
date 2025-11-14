// api/models/ServiceOrder.js
const mongoose = require('mongoose');
const serviceOrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  licensePlate: { type: String, required: true },
  vehicleType: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: [String],
  additionalWork: String
}, { timestamps: true });
module.exports = mongoose.model('ServiceOrder', serviceOrderSchema);
