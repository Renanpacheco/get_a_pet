const express = require('express');
const cors = require('cors'); //using for connecting with frontend
const userRoutes = require('./routes/UserRoutes');
const petRoutes = require("./routes/PetRoutes");
const port = 5000;

const app = express();

//config json response
app.use(express.json());

//cors
app.use(cors({credentials: true, origin: 'http://localhost:3000'})); //front use port 3000

//public images
app.use(express.static('public/images'))

//routes
app.use("/users", userRoutes);
app.use("/pets", petRoutes);

app.listen(port); //front use port 5000