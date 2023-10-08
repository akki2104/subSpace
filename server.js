const express = require('express');


const routes=require("./routes/route")
const app = express();
const port = 3000; // Set your desired port number



// middleware to be implemented
app.use('/api', routes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
