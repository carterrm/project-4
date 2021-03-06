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
    try {
        let newEntry = new reservation({
            userID: req.body.userID,
            numHours: req.body.hoursBooked,
            aircraftID: req.body.aircraftID
        });
        await newEntry.save();
        res.send(newEntry);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/reservations/:userID', async (req, res) => {
    try {
      let reservations = await reservation.find({userID: req.params.userID});
      res.send(reservations);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put('/api/reservations/edit/', async (req, res) => {
    try {
        let item = await reservation.findOne({userID: req.body.userID, aircraftID: req.body.aircraftID});
        if (!item) {
            res.sendStatus(404);
            return;
        }
        item.numHours = req.body.hoursReserved;
        item.userID = req.body.userID;
        item.aircraftID = req.body.aircraftID;
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
    description: String
});

const entry = mongoose.model('Entry', LogbookEntrySchema);

app.get('/api/logbook/:userID', async (req, res) => {
    try {
      let logbook = await entry.find({userID: req.params.userID});
      res.send(logbook);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post('/api/logbook/:userID/', async (req, res) => {
    try {
        let newEntry = new entry({
            userID: req.body.userID,
            numHours: req.body.numHours,
            aircraftID: req.body.aircraftID,
            description: req.body.description
        });
        await newEntry.save();
        res.send(newEntry);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/entries/:userID/:_id', async (req, res) => {
  try {
      let item = await entry.findOne({_id:req.params.itemID, _id: req.params._id});
      if (!item) {
          res.send(404);
          return;
      }
      await item.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));