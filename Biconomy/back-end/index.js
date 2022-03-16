const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
    calculateSum,
    getSum
} = require('./getlogs.js')

const app = express()

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Welcome to Verida Home! - ' + PORT));

app.get('/calculateSum/:left/:right', async(req, res) => {
    const {left, right} = req.params;
    const result = await calculateSum(left, right);
    console.log("Result = ", result);
    res.status(201).json(result);
})

app.get('/getSum', async(req, res) => {
    const result = await getSum();
    console.log("Result = ", result);
    res.status(201).json({result});
})


app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
});