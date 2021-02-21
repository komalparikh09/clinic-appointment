const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');

const ObjectId = mongodb.ObjectId;

const router = Router();

// Logs an error in the errorlog collection
router.post('', (req, res, next) => {
  const newError = {
    message: req.body.message,
    create_dt: new Date()
  };
  db.getDb()
    .db()
    .collection('errorlog')
    .insertOne(newError)
    .then(result => {
      console.log(result);
      res
        .status(201)
        .json({ message: 'Error logged successfully. Error ID: ' + result.insertedId });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

module.exports = router;