const express = require('express');
const cors = require('cors'); //using for connecting with frontend
const userRoutes = require('./routes/UserRoutes'); //investigate why this error is happening when the name is userRoutes Already included file name 'd:/praticando/curso node/get a pet/routes/userRoutes.js' differs from file name 'd:/praticando/curso node/get a pet/routes/UserRoutes.js' only in casing.\n  The file is in the program because:\n    Imported via './routes/userRoutes' from file 'd:/praticando/curso node/get a pet/index.
const port = 5000;

const app = express();

//config json response
app.use(express.json());

//cors
app.use(cors({credentials: true, origin: 'http://localhost:3000'})); //front use port 3000

//public images
app.use(express.static('public/images'))

//routes
app.use('/users', userRoutes);

app.listen(port); //front use port 5000