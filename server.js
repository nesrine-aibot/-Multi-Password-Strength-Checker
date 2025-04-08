// server.js
const express = require('express');
const cors = require('cors');
const app = express();

const passwordRoutes = require('./routes/passwordChecks');

app.use(cors());
app.use(express.json());
app.use('/api', passwordRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
