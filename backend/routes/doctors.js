const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');

const ObjectId = mongodb.ObjectId;

const router = Router();

// const doctors = [
//   {
//     name: 'Amrita Gopan',
//     phoneNumber: '9887766543',
//     specialization: 'MBBS',
//     totalExperience: '5',
//     workingDays: ['Mon', 'Tue', 'Wed', 'Thu'],
//     visitingHoursFrom: '09:00',
//     visitingHoursTo: '20:00'
//   },
//   {
//     name: 'Bhaskar Arora',
//     phoneNumber: '9887766541',
//     specialization: 'MD-ENT',
//     totalExperience: '11',
//     workingDays: ['Mon', 'Tue', 'Wed', 'Thu'],
//     visitingHoursFrom: '10:00',
//     visitingHoursTo: '18:00'
//   },
//   {
//     name: 'Satyajit Banerjee',
//     phoneNumber: '9887766542',
//     specialization: 'MD-Cardiology',
//     totalExperience: '10',
//     workingDays: ['Mon', 'Tue', 'Wed', 'Thu'],
//     visitingHoursFrom: '08:00',
//     visitingHoursTo: '16:00'
//   },
//   {
//     name: 'Dhanush Avaru',
//     phoneNumber: '9887566543',
//     specialization: 'MD-Physician',
//     totalExperience: '4',
//     workingDays: ['Mon', 'Tue', 'Wed', 'Thu'],
//     visitingHoursFrom: '09:00',
//     visitingHoursTo: '17:00'
//   },
//   {
//     name: 'Gargi Chatterjee',
//     phoneNumber: '9887743543',
//     specialization: 'MBBS',
//     totalExperience: '8',
//     workingDays: ['Mon', 'Tue', 'Wed', 'Thu'],
//     visitingHoursFrom: '10:00',
//     visitingHoursTo: '19:00'
//   },
//   {
//     name: 'Rajit Rao',
//     phoneNumber: '9887799543',
//     specialization: 'MD-Pathology',
//     totalExperience: '7',
//     workingDays: ['Mon', 'Tue', 'Wed', 'Thu'],
//     visitingHoursFrom: '09:00',
//     visitingHoursTo: '18:00'
//   }
// ];

// Get list of doctors doctors
router.get('/', (req, res, next) => {
  const queryPage = req.query.page;
  const pageSize = 1;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  const doctors = [];
  db.getDb()
    .db()
    .collection('doctors')
    .find()
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

// Register a new doctor and generate a unique doctor ID
// Requires logged in user
router.post('', (req, res, next) => {
  const newDoctor = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    specialization: req.body.specialization,
    totalExperience: req.body.totalExperience,
    workingDays: req.body.workingDays,
    visitingHoursFrom: req.body.visitingHoursFrom,
    visitingHoursTo: req.body.visitingHoursTo
  };
  db.getDb()
    .db()
    .collection('doctors')
    .insertOne(newDoctor)
    .then(result => {
      console.log(result);
      res
        .status(201)
        //.json({ message: 'You have been registered successfully. Please save your Doctor ID: ', doctorId: result.insertedId });
        .json({ message: 'You have been registered successfully. Please save your Doctor ID: ' + result.insertedId });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});
// Edit existing doctor
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedDoctor = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    specialization: req.body.specialization,
    totalExperience: req.body.totalExperience,
    workingDays: req.body.workingDays,
    visitingHoursFrom: req.body.visitingHoursFrom,
    visitingHoursTo: req.body.visitingHoursTo
  };
  db.getDb()
    .db()
    .collection('doctors')
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: updatedDoctor
      }
    )
    .then(result => {
      res
        .status(200)
        .json({ message: 'Doctor details updated successfully: ', doctorId: req.params.id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

// Delete a doctor record
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection('doctors')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(result => {
      res.status(200).json({ message: 'Doctor record has been deleted successfully' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

module.exports = router;