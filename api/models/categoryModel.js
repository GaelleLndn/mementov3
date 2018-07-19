mongoose = require ('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    label: {type: String, required: true, max: 50, unique: true},
    log: [{type: mongoose.Schema.Types.ObjectId, ref: 'Log'}]
})


module.exports = mongoose.model('Category', categorySchema);