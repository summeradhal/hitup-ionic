var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventPostSchema = new Schema({
	username: {type: String, required: true},
	eventTitle:{type: String, required: true},
	place:  {type: String, required: true},
	eventTime: {type: Date},
	eventDescription:{type:String},
	eventType:{ type: String }
});

module.exports = mongoose.model('eventPost', eventPostSchema);