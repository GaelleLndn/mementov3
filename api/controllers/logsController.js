const mongoose = require ('mongoose');

const Log = require ('../models/logModel');
const Category = require ('../models/categoryModel');


// GET ALL LOGS
exports.logs_get_all = (req, res, next) => {
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
};


// CREATE LOG
exports.logs_create_log = (req, res, next) => {
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
};


// GET LOG BY ID
exports.logs_get_log_by_id = (req, res, next) => {
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
};


// UPDATE LOG BY ID
exports.logs_update_log_by_id = (req, res, next) => {
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
};



// DELETE LOG BY ID
exports.logs_delete_log_by_id = (req, res, next) => {
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
};
