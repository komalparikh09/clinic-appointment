const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');

const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of patients
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
    const patients = [];
    db.getDb()
        .db()
        .collection('patients')
        .find()
        .sort({ patientId: -1 })
        // .skip((queryPage - 1) * pageSize)
        // .limit(pageSize)
        .forEach(patientDoc => {
            patients.push(patientDoc);
        })
        .then(result => {
            res.status(200).json(patients);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Get single patient
router.get('/:id', (req, res, next) => {
    db.getDb()
        .db()
        .collection('patients')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(patientDoc => {
            res.status(200).json(patientDoc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Get list of all appointments of the patient
router.get('/:patientPhone', (req, res, next) => {
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
    db.getDb()
        .db()
        .collection('appointments')
        .find({ "patientPhone": new String(req.params.patientPhone) })
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
});

// Register a new patient and generate a unique patient ID
// Requires logged in user
router.post('', (req, res, next) => {
    const newPatient = {
        patientName: req.body.patientName,
        patientPhone: req.body.patientPhone,
        patientAge: req.body.patientAge,
        patientGender: req.body.patientGender,
        patientProblem: req.body.patientProblem,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime
    };
    db.getDb()
        .db()
        .collection('patients')
        .insertOne(newPatient)
        .then(result => {
            console.log(result);
            res
                .status(201)
                .json({ message: 'You have been registered successfully. Patient ID: ', patientId: result.insertedId });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});
// Edit existing patient
// Requires logged in user
router.patch('/:id', (req, res, next) => {
    const updatedPatient = {
        patientName: req.body.patientName,
        patientPhone: req.body.patientPhone,
        patientAge: req.body.patientAge,
        patientGender: req.body.patientGender,
        patientProblem: req.body.patientProblem,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime
    };
    db.getDb()
        .db()
        .collection('patients')
        .updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: updatedPatient
            }
        )
        .then(result => {
            res
                .status(200)
                .json({ message: 'Patient details updated successfully: ', patientId: req.params.id });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Delete a patient record
// Requires logged in user
router.delete('/:id', (req, res, next) => {
    db.getDb()
        .db()
        .collection('patients')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(200).json({ message: 'Patient record has been deleted successfully' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

module.exports = router;