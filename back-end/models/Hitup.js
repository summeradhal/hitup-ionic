var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hitupSchema = new Schema({
	hitupTotal:{type:Number,required:true},
	username: {type: String, required: true},
	hitupUsername:{type:String,required:true},
	hitupId:{type:String,required:true}

});

module.exports = mongoose.model('hitup', hitupSchema);