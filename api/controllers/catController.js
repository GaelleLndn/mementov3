const mongoose = require('mongoose')

const Category = require ('../models/categoryModel');
const Log = require ('../models/logModel');


// GET ALL CATEGORIES
exports.cat_get_all = (req, res, next) => {
    Category.find()
    .select("_id label log")
    .populate('log', 'title')
    .exec()
    .then(docs => {
        const response = {
            count : docs.length, 
            categories: docs.map(doc => { 
                return {
                    _id : doc._id,
                    label : doc.label,
                    log : doc.log,
                    request : {
                       type: 'GET',
                       url: 'http://localhost:8000/categories/' + doc._id
                   }
               }
           })
       }
        
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
}



// CREATE CATEGORY
exports.cat_create_category = (req, res, next) => {
    Category.find({ label: req.body.label })
    .exec()
    .then( category => {
        if (category.length >=1) {
            return res.status(409).json({
                message: 'This category already exist'
            })
        } else {
            const category = new Category({
                _id : new mongoose.Types.ObjectId(),
                label: req.body.label,
                log: req.body.log
            });
            category.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message:'Created category successfully',
                    createdCategory: {
                        _id : result._id,
                        label : result.label,
                        log : result.log
                    },
                    request : {
                        type: 'GET',
                        url: 'http://localhost:8000/categories/' + result._id
                    } 
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
        }
    });
}



// GET CATEGORY BY ID
exports.cat_get_category_by_id = (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id)
    .select('_id label log')
    .populate('log', 'title')
    .exec()
    .then(category => {
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }
        res.status(200).json({
            category: category,
            request: {
                type: 'GET',
                description: 'Get all categories',
                url: 'http://localhost:8000/categories'
            }
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({ 
            error : err, 
            message: "This ID is not valid"
        })
    });  
}



// UPDATE CATEGORY BY ID
exports.cat_update_category_by_id = (req, res, next) => {
    const id = req.params.categoryId;
    const updateOps = {};
    for( const ops of req.body){
        updateOps[ops.propertyName] = ops.value;
    }
    Category.update({ _id : id}, {$set: updateOps })
    .exec()
    .then (result => {
        console.log(result);
        res.status(200).json({
            message: 'Category updated successfully',
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
}


// DELETE CATEGORY BY ID
exports.cat_delete_category_by_id = (req, res, next) => {
    const id = req.params.categoryId;
    Category.remove({ _id : id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'category deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:8000/categories/',
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}


