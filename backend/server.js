// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("College Marketplace Backend Running");
});
// server.js (add these below app.use(express.json()))
const productRoutes = require('./routes/productRoutes');
// server.js
const userRoutes = require('./routes/userRoutes');
const messRoutes = require('./routes/messRoutes');
const bussRoutes = require('./routes/bussRoutes');
const networkRoutes = require("./routes/networkRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);



app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/bus', bussRoutes);
app.use("/api/network", networkRoutes);

      

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
