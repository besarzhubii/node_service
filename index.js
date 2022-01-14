const express = require('express');

let app = express();

app.listen(3000, () => {
    console.log('Server is up and running in port 3000');
})