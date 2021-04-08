const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/EagleFlight', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: String,
    id: Number
  });

const user = mongoose.model('User', userSchema);

const reservationSchema = new mongoose.Schema({
    userID: Number,
    numHours: Number,
    aircraftID: String
});

const reservation = mongoose.model('Reservation', reservationSchema);

app.post('/api/reservations/:userID/', async (req, res) => {
    console.log("entered Server Post for reservations");
    try {
        let newRes = new reservation({
            userID: req.body.userID,
            numHours: req.body.hoursBooked,
            aircraftID: req.body.aircraftID
        });
        await newRes.save();
        console.log("Reservation for" + req.params.aircraftID + "updated- returning item to client");
        res.send(newRes);
    } catch (error) {
        console.log("Error saving reservation for " + req.params.aircraftID);
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/reservations/:userID', async (req, res) => {
  console.log("Entered Server Get for reservations");
    try {
      let reservations = await reservation.find({userID: req.params.userID});
      console.log(reservations);
      res.send(reservations);
      console.log("Sent reservations to client successfully");
    } catch (error) {
        console.log("Error in getting reservations for client")
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put('/api/reservations/edit/', async (req, res) => {
    try {
        let item = await Item.findOne({userID: req.body.userID, aircraftID: req.body.aircraftID});
        if (!item) {
            console.log("reservation not found")
            res.sendStatus(404);
            return;
        }
        item.numHours = req.body.hoursReserved;
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

const LogbookEntrySchema = new mongoose.Schema({
    userID: Number,
    numHours: Number,
    aircraftID: String,
    text: String
});

const entry = mongoose.model('Entry', LogbookEntrySchema);



app.listen(3000, () => console.log('Server listening on port 3000!'));