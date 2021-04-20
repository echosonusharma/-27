const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');


const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/:id', (req, res) => {
    // redirect to url
})

app.post('/url', (req, res) => {
    // create a short url
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Sprinting at PORT ${PORT}`);
})