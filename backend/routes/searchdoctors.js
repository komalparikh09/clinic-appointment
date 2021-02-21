const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');

const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of doctors doctors
router.get('/', (req, res, next) => {
  // const queryPage = req.query.page;
  // const pageSize = 1;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  //const query = { $and: [{ $text: { $search: req.query.specialization.replace(/,/g,"") }}, { $text: { $search: req.query.workingDays.replace(/,/g,"") }}] };
  const query = '\"' + req.query.specialization.replace(/,/g,"").split(' ').join('\" \"') + '\" ' + req.query.workingDays.replace(/,/g,"");
  const doctors = [];
  db.getDb()
    .db()
    .collection('doctors')
    .createIndex({ "specialization": "text", "workingDays": "text" });
  db.getDb()
    .db()
    .collection('doctors')
    .find({ $text: { $search: query }})
    .sort({ doctorId: -1 })
    // .skip((queryPage - 1) * pageSize)
    // .limit(pageSize)
    .forEach(doctorDoc => {
      doctors.push(doctorDoc);
    })
    .then(result => {
      res.status(200).json(doctors);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

// Get single doctor
router.get('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection('doctors')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(doctorDoc => {
      res.status(200).json(doctorDoc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

// Get multiple doctors based on specialization and availability
router.get('/:specialization, /:workingDays', (req, res, next) => {
  db.getDb()
    .db()
    .collection('doctors')
    .find({ $and: [{ $text: {$search: new String(req.params.specialization.replace(",", ""))}}, { $text: {$search: new String(req.params.workingDays.replace(",", ""))}}] })
    .then(doctorDoc => {
      res.status(200).json(doctorDoc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

//Get appointments for the doctor dashboard using patient details, phone number and appointment date
router.get('/searchdoctors/', (req, res, next) => {
  const queryPage = req.query.page;
  const pageSize = 1;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  const appointments = [];
  if (req.query.patientPhone.trim() !== '' && req.query.appointmentDate.trim() === '')
  {
      db.getDb()
      .db()
      .collection('appointments')
      .find({ "patientPhone": req.query.patientPhone })
      // .skip((queryPage - 1) * pageSize)
      // .limit(pageSize)
      .forEach(appointmentDoc => {
          appointments.push(appointmentDoc);
      })
      .then(result => {
          res.status(200).json(appointments);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'An error occurred.' });
      });
  }
  else if (req.query.appointmentDate.trim() !== '' && req.query.patientPhone.trim() === '')
  {
      db.getDb()
      .db()
      .collection('appointments')
      .find({ "appointmentDate": req.query.appointmentDate })
      // .skip((queryPage - 1) * pageSize)
      // .limit(pageSize)
      .forEach(appointmentDoc => {
          appointments.push(appointmentDoc);
      })
      .then(result => {
          res.status(200).json(appointments);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'An error occurred.' });
      });
  }
  else if (req.query.patientPhone.trim() !== '' && req.query.appointmentDate.trim() !== '')
  {
      db.getDb()
      .db()
      .collection('appointments')
      .find({ $and: [{ "patientPhone": req.query.patientPhone }, { "appointmentDate": req.query.appointmentDate }]})
      // .skip((queryPage - 1) * pageSize)
      // .limit(pageSize)
      .forEach(appointmentDoc => {
          appointments.push(appointmentDoc);
      })
      .then(result => {
          res.status(200).json(appointments);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'An error occurred.' });
      });
  }
});

module.exports = router;