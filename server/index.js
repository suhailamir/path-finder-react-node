import {getDestinations,getFares} from './controllers/tripFinder';
import express from 'express';
import  bodyParser  from 'body-parser';
import fares from './data/fares.json';



const app = express();
const port = 4545;
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/destinations', getDestinations);
 app.post('/get-fares', getFares);




app.listen(port, () => console.log(`Example app listening on port ${port}!`))