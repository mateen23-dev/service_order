// api/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// simple request logger to surface requests in the API console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/serviceorders';
let useDb = false; // switch to true when DB connection established
const inMemoryStore = []; // fallback store if DB is unavailable

// Define schema (used only if DB is active)
const orderSchema = new mongoose.Schema({
  customerName: String,
  licensePlate: String,
  vehicleType: String,
  email: String,
  phone: String,
  services: [String],
  additionalWork: String
});
// Note: do not instantiate model until DB connected to avoid errors
let ServiceOrder = null;

// Start listening first, do not claim mode until DB resolves
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}/`));

// Try to connect to MongoDB (no deprecated options)
mongoose.connect(mongoUrl)
  .then(() => {
    ServiceOrder = mongoose.model('ServiceOrder', orderSchema);
    useDb = true;
    console.log('Connected to MongoDB:', mongoUrl);
    console.log('API switched to MongoDB backend.');
  })
  .catch(err => {
    console.error('DB connection error:', err.message || err);
    console.error('Falling back to in-memory storage. Data will be ephemeral (lost on restart).');
    console.error('- To use persistent DB, install/run mongod or set MONGO_URL to a reachable MongoDB instance (Atlas/Docker).');
    console.error('- Docker quick start: docker run -d --name mongo-local -p 27017:27017 -v mongo-data:/data/db mongo:6');
    useDb = false;
  });

// Helper: generate an id for in-memory items
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Routes
// Create
app.post('/api/service-orders', async (req, res) => {
  if (useDb && ServiceOrder) {
    try {
      const order = new ServiceOrder(req.body);
      const saved = await order.save();
      return res.status(201).json(saved);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // In-memory fallback
  const id = genId();
  const order = { _id: id, ...req.body };
  inMemoryStore.push(order);
  return res.status(201).json(order);
});

// Read All
app.get('/api/service-orders', async (req, res) => {
  if (useDb && ServiceOrder) {
    try {
      const orders = await ServiceOrder.find();
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  return res.json(inMemoryStore);
});

// Read One
app.get('/api/service-orders/:id', async (req, res) => {
  const id = req.params.id;
  if (useDb && ServiceOrder) {
    try {
      const order = await ServiceOrder.findById(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json(order);
    } catch (err) {
      return res.status(404).json({ error: 'Order not found' });
    }
  }
  const order = inMemoryStore.find(o => (o._id === id || o.id === id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
});

// Update
app.patch('/api/service-orders/:id', async (req, res) => {
  const id = req.params.id;
  if (useDb && ServiceOrder) {
    try {
      const updated = await ServiceOrder.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  const idx = inMemoryStore.findIndex(o => (o._id === id || o.id === id));
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  inMemoryStore[idx] = { ...inMemoryStore[idx], ...req.body };
  return res.json(inMemoryStore[idx]);
});

// Health route to check which mode we're in
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    backend: useDb ? 'mongodb' : 'in-memory',
    mongoUrl: useDb ? mongoUrl : null
  });
});

// quick root page to verify API process is running from browser
app.get('/', (req, res) => {
  res.send(`<html><body><h2>Service Order API running</h2><pre>backend: ${useDb ? 'mongodb' : 'in-memory'}</pre><p>Health: <a href="/api/health">/api/health</a></p></body></html>`);
});

// process-level handlers to surface errors in the console
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});
