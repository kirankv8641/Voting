 require('dotenv').config();
const express = require('express');
const db = require('./db'); // Ensure the database connection is established
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;


const userRoutes=require('./routes/userRoutes');
app.use('/user',userRoutes);
const candidateRoutes=require('./routes/candidateRoutes');
app.use('/candidate',candidateRoutes);

app.listen(PORT, () => {
  console.log('Listening on port 3000');
})