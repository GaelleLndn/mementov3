const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');

const Log = require ('../models/logModel');
const Category = require ('../models/categoryModel');


// GET on localhost:800/logs
router.get('/', (req, res, next) => {
    Log.find()
    .select('_id title date category')
    .populate('category', 'label')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            logs: docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    date: doc.date,
                    category: doc.category,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/logs/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
    
});

// POST on localhost:800/logs
router.post('/', (req, res, next) => {

    Category.findById(req.body.category)
        .then( category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }
            const log = new Log ({
                _id: mongoose.Types.ObjectId(),
                title : req.body.title,
                date: req.body.date,
                category: req.body.category
            });
            return log.save()
        })
    .then( result => {
        console.log(result);
        res.status(201).json({
            message: 'log saved',
            createdLog: {
                _id: result._id,
                title: result.title,
                date: result.date,
                category: result.category
            },
            request: {
                type: 'GET',
                url: 'http://localhost:8000/logs/' + result._id
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// GET on localhost:800/logs/id
router.get('/:logId', (req, res, next) => {
    const id = req.params.logId;
    Log.findById(id)
    .select('—id title date log')
    .populate('category', 'label')
    .exec()
    .then( log => {
        if(!log) {
            return res.status(404).json({
                message: "log not found"
            })
        }
        res.status(200).json({
            log: log,
            request: {
                type: 'GET',
                description: 'Get all logs',
                url: 'http://localhost:8000/logs/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            message: "This ID is not valid"
        })
    })
});

// PATCH on localhost:800/logs/id
router.patch('/:logId', (req, res, next) => {
    const id = req.params.logId;
    const updateOps = {};
    for( const ops of req.body){
        updateOps[ops.propertyName] = ops.value;
    }
    Log.update({ _id : id}, {$set: updateOps })
    .exec()
    .then (result => {
        console.log(result);
        res.status(200).json({
            message: 'Log updated successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:8000/categories/' + id
            }
        });
    })
    .catch (err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


// DELETE on localhost:800/logs/id
router.delete('/:logId', (req, res, next) => {
    const id = req.params.logId;
    Log.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Log deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:8000/logs/',
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router