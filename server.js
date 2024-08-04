/* eslint-disable */
import express from 'express';
import routes from './routes/index.js';
import bodyParser from 'body-parser';


const app = express();
const port = process.env.PORT || 5000;

// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});