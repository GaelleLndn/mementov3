const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/userModel');


// CREATE USER WITH HASH PASSWORD
router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then( user => {
            if (user.length >=1) {
                return res.status(409).json({
                    message: 'This email already exist'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash ) => {
                    if (err) { 
                        return res.status(500).json({
                            message: 'probleme dans le hash',
                            error: err
                        });
            
                    } else {
                        const user = new User ({
                            _id : new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log (result);
                                res.status(201).json({
                                    message: 'User created successfully'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    message: 'probleme dasn le save user',
                                    error: err
                                })
                            })
                    }
                });
            }
        })
});



// DELETE USER
router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id : id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'user deleted successfully'
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
});


module.exports = router