const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');

const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of appointments
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
    const appointments = [];
    db.getDb()
        .db()
        .collection('appointments')
        .find()
        .sort({ appointmentId: -1 })
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

//Get appointments for the doctor dashboard using doctor details, id and phone number
router.get('/doctordetails/', (req, res, next) => {
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
    if (req.query.doctorId.trim() !== '' && req.query.phoneNumber.trim() === '')
    {
        db.getDb()
        .db()
        .collection('appointments')
        .find({ "doctorId": new ObjectId(req.query.doctorId) })
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
    else if (req.query.phoneNumber.trim() !== '' && req.query.doctorId.trim() === '')
    {
        db.getDb()
        .db()
        .collection('appointments')
        .find({ "phoneNumber": req.query.phoneNumber })
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
    else if (req.query.doctorId.trim() !== '' && req.query.phoneNumber.trim() !== '')
    {
        db.getDb()
        .db()
        .collection('appointments')
        .find({ $and: [{ "doctorId": new ObjectId(req.query.doctorId) }, { "phoneNumber": req.query.phoneNumber }]})
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

//Get appointments for the doctor dashboard using patient details, phone number and appointment date
router.get('/patientdetails/', (req, res, next) => {
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

// Get list of all appointments for that specific doctor
router.get('/datetime/', (req, res, next) => {
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
        .find({ "doctorId": new ObjectId(req.query.doctorId) })
        //.aggregate([{$lookup: {from: "doctors", localField: "doctorName", foreignField: "_id", as: "doctorId"}}])
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

// Get single appointment
router.get('/:id', (req, res, next) => {
    db.getDb()
        .db()
        .collection('appointments')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(appointmentDoc => {
            res.status(200).json(appointmentDoc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// // Get single appointment for edit mode
// router.get('/:id/:mode', (req, res, next) => {
//     db.getDb()
//         .db()
//         .collection('appointments')
//         .findOne({ _id: new ObjectId(req.params.id) })
//         .then(appointmentDoc => {
//             res.status(200).json(appointmentDoc);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ message: 'An error occurred.' });
//         });
// });

// Get list of all appointments of the patient with the given phone number
router.get('/patient/:patientPhone', (req, res, next) => {
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
        .find({ "patientPhone": req.params.patientPhone })
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

// Confirms an appointment and generate a unique appointment ID
// Requires logged in user
router.post('', (req, res, next) => {
    const newAppointment = {
        doctorId: ObjectId(req.body.id),
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        specialization: req.body.specialization,
        totalExperience: req.body.totalExperience,
        workingDays: req.body.workingDays,
        patientName: req.body.patientName,
        patientPhone: req.body.patientPhone,
        patientAge: req.body.patientAge,
        patientGender: req.body.patientGender,
        patientProblem: req.body.patientProblem,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime,
    };
    db.getDb()
        .db()
        .collection('appointments')
        .insertOne(newAppointment)
        .then(result => {
            console.log(result);
            res
                .status(201)
                // .json({ message: 'Appointment confirmed. Appointment ID: ', appointmentId: result.insertedId });
                .json({ message: 'Appointment confirmed. Appointment ID: ' + result.insertedId });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Edit existing appointment
// Requires logged in user
router.patch('/:id', (req, res, next) => {
    const updatedAppointment = {
        patientName: req.body.patientName,
        patientPhone: req.body.patientPhone,
        patientAge: req.body.patientAge,
        patientGender: req.body.patientGender,
        patientProblem: req.body.patientProblem,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime,
        doctorId: ObjectId(req.body.id),
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        specialization: req.body.specialization,
        totalExperience: req.body.totalExperience,
        workingDays: req.body.workingDays,
    };
    db.getDb()
        .db()
        .collection('appointments')
        .updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: updatedAppointment
            }
        )
        .then(result => {
            res
                .status(200)
                // .json({ message: 'Appointment details updated successfully: ', appointmentId: req.params.id });
                .json({ message: 'Appointment details updated successfully for Appointment ID: ' + req.params.id });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Delete an appointment
// Requires logged in user
router.delete('/:id', (req, res, next) => {
    db.getDb()
        .db()
        .collection('appointments')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(200).json({ message: 'Appointment has been cancelled' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

module.exports = router;