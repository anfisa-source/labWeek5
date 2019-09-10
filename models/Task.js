const mongoose = require('mongoose');
var permitted = ['INPROGRESS','COMPLETE']
let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    assign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    due: {
        type: Date
    },
    status: {
        type: String,
        enum: permitted,
        uppercase: true
    },
    desc: {
        type: String
    }
});
module.exports = mongoose.model('Task', taskSchema);