const mongoose = require('mongoose')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require ('../models/userModel');


// USER SIGNUP
exports.users_create_user = (req, res, next) => {
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
}


// USER LOGIN
exports.users_login_user = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Auth failed 1'
            });
        } 
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed 2'
                });
            }
            if(result) {
                const token = jwt.sign(
                    {
                    email: user[0].email,
                    userId: user[0]._id
                    }, 
                    'secret',
                    {
                    expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed 3'
            });
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
};


// DELETE USER BY ID
exports.users_delete_user_by_id = (req, res, next) => {
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
};