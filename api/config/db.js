// api/config/db.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/serviceorders');
mongoose.connection.on('open', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', err => console.error('MongoDB error:', err));
