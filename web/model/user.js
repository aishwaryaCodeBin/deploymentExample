// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  user_type: String,
  token : String,
  username:String,
  facebook_id:String,
  email:String,
  hashed_password: String, 
  salt : String,
  temp_str:String,
  created_at: { type : Date, default: Date.now },
  updated_at: { type : Date, default: Date.now }
});

var SubjectsSchema = new Schema({
  subject_id: String,
  subject_name : String,
  subject_subtitle:String,
  subject_image:String,
  children:Array,
  parent:String
});

// create a schema
var lectureSchema = new Schema({
  title: String,
  teacher_id: String,
  subscribed_user_id: [ { type:  String} ],
  type: [ { type:  String} ],
  video_url:String,
  datetime: { type : Date},
  created_at: { type : Date, default: Date.now },
  updated_at: { type : Date, default: Date.now }
});


// we need to create a model using it
var User = mongoose.model('User', userSchema);
var Lecture = mongoose.model('Lecture', lectureSchema);
var Subject = mongoose.model('Subject', SubjectsSchema);

// make this available to our users in our Node applications
module.exports = [User,Lecture,Subject];