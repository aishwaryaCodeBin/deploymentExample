var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var questionSchema = mongoose.Schema({ 

 id : String,
 type: String, 
 category_id: String,
 subcat_id : String,
topic_id : String,
expertise: Number,
allowed_exams: Array,
content :String,
Options :Array,
//Array can be a key value pair or an image of just string depending on the question time
/*32^12 : correct
32^22: incorrect
22^12: incorrect
32: incorrect*/
timed : String,
Hint : String

});



var question = mongoose.model('newquestion', questionSchema); 



module.exports = question;