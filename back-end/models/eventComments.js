var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventCommentsSchema = new Schema({
	username: {type: String, required: true},
	comment:{type:String,required:true},
	eventPostId:{type:String,required:true}
});

module.exports = mongoose.model('eventComments', eventCommentsSchema);