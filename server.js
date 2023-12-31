const express = require('express');
const app = express();
const cors = require('cors');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');

// configure cors
app.use(cors());

// configure express to receive the form data
app.use(express.json());

// configure dotEnv
dotEnv.config();

// get Hostname , port
const hostname = process.env.HOST_NAME;
const port = process.env.PORT;

// configure the router
app.use('/api', require('./routers/taskRoutes'));

// connect to MongoDB database
mongoose.connect(process.env.MONGO_DB_LOCAL_URL, {
    
}).then((response) => {
    console.log('Connected to MongoDB Successful................');
}).catch((error) => {
    console.error(error);
    process.exit(1); // stop the node js process if unable to connect to DB
});

// empty URL
app.get('/', (request , response) => {
    response.send(`<h2>Welcome to TODO-Application</h2>`);
});

app.listen(port, hostname, () => {
   console.log(`Express server is started at http://${hostname}:${port}`)
});
