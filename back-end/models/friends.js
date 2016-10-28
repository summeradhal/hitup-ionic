var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendsSchema = new Schema({
	friendUsername: {type: String, required: true},
	username:  {type: String, required: true},

});

module.exports = mongoose.model('friends', friendsSchema);