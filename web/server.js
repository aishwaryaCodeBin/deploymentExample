var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server=require('http').createServer(app);

//var io= require('socket.io').listen(server);
var multer  = require('multer');
var mongoose= require("mongoose");
var questionTable= require("./mongodbSchemas.js");
var model = require('./model/user');
var User = model[0];
var SubjectsTable=model[2];
app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname ));
app.use('/js',express.static(__dirname + '/js'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/templates',express.static(__dirname + '/templates'));
app.use('/partials',express.static(__dirname + '/partials'));
app.use('/views',express.static(__dirname + '/views'));

app.use(bodyParser.json());


server.listen(app.get('port'));


var done=false;

/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
  console.log("in change file name");
  return filename+Date.now();
},
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

app.post('/auth', function(req, res) {
  console.log("authentication = "+req.session_state.isLogedIn);
  res.send({"response":"response","auth":req.session_state.isLogedIn});
});

app.get('/p', function(req, res) {
  
  res.sendfile("progressbar.html");
});

app.get('/login', function (req, res){
  /*if (req.session_state.isLogedIn) {
    console.log("Logged in!");
  } else {
    req.session_state.isLogedIn=false; 
    console.log("Not logged in");
  }*/
  res.sendfile("indextwo.html");
});

app.get('/login', function (req, res){
  res.sendfile("indextwo.html");
});


/*for(var i=0;i<foldersArray.length; i++){
 // The loop make's several call's with different folder ID's.
 printBookmarks(foldersArray[i], thingsToDoAfter);
}

function thingsToDoAfter() {
// I'd like any code here to be run only after the above has 
//finished processing.
}

var count = 0;

function printBookmarks(id, callback) {
 count++;
 chrome.bookmarks.getChildren(id, function(children) {
    children.forEach(function(bookmark) { 
      console.debug(bookmark.title);
      printBookmarks(bookmark.id, callback);
    });
    count--;
    if (count == 0 && callback)
      callback();
 });
}

*/
var ansestorsArray=[];
var callbackfunction=function(id,callback){
  console.log(id);
  if(id<10){
    id++;
    callbackfunction(id,function(){ });
  callback({"result":id});
  ansestorsArray.push(id);
}else{
  callback();
}
}
var done=false;
var ansestors= function(child_id,callback){

    SubjectsTable.findOne({_id:child_id},function(err,result){
      if(result!=null){
        // console.log("result.parent "+result.subject_name);
         ansestorsArray.push(result.subject_name);
        if(result.parent!=undefined){
          ansestors(result.parent,callback);
           callback({"resp":child_id});
        }else{
          console.log("in else");
done=true;
          callback();
        }
      }else{
       callback();
        //child_id not found.. a case which is not possible.
      }
    })

}

/*var ansestors= function(child_id){

    SubjectsTable.findOne({_id:child_id},function(err,result){
      if(result!=null){
         console.log("result.parent "+result.subject_name);
         ansestorsArray.push(result.subject_name);
        if(result.parent!=undefined){
          ansestors(result.parent);
        }else{
          return child_id;
        }
      }else{
        return child_id;
        //child_id not found.. a case which is not possible.
      }
    })

}
*/


app.post('/getAnsestors', function (req, res){
var name= req.body.name;
done=false;
ansestorsArray=[];
SubjectsTable.findOne({subject_name:name},function(err,result){
  if(result!=null){
     ansestors(result._id,function(ansresult){
  //console.log("callback result "+ansresult);
  if(done){
  console.log("ansestorsArray "+ansestorsArray);
  res.send({"parents":ansestorsArray});
}
 });
   }else{
    res.send({"response":"no subject found"});
   }
})

 

 /*callbackfunction(5,function(result){
  console.log("res "+result.result);
   console.log("ansestorsArray "+ansestorsArray);
 })*/
});









app.get('/getSubject', function (req, res){
  var subjectArray=[];
   SubjectsTable.find({parent:undefined},function(err,result){
    if(result.length!=0){
      for (var i = 0; i < result.length; i++) {
        subjectArray.push(result[i].subject_name);
      };
res.send({"response":"success","subjectArray":subjectArray});
      console.log("subject name "+subjectArray);

    }else{
      console.log("no subject name "+err);
      res.send({"response":"success no subject name"});
    }
});

});
app.post('/getParents', function (req, res){
 // res.sendfile("indextwo.html");
 var parentsArray=[];
 var child=req.body.name;
   SubjectsTable.findOne({subject_name: child},function(err,childresult){
      if(childresult!=null){
         var parent_id=childresult.parent;
         SubjectsTable.findOne({_id: parent_id},function(err,result){
         var parent_name= result.subject_name;
         res.send({"response":"Successfull","parent":parent_name});
         });
      }else{
        res.send({"response":"Unsuccessfull"});
      }
      //var child_id=childresult._id;

      
/*while(child_id!=undefined){
    SubjectsTable.findOne({_id: child_id},function(err,childresult){
     if(childresult.parent!= undefined){
       console.log("childresult.parent " + childresult.parent);
      }
    });
  }*/
    
   });

});


app.post('/getChildren', function (req, res){
  // find the subject name from request body.
  // check all the rows which have subject name as parent.
  var parent= req.body.name;
  SubjectsTable.findOne({subject_name: parent},function(err,parentresult){
    if(parentresult!=null){
      var parentid= parentresult._id;
      console.log("parentid "+parentid);
      SubjectsTable.find({parent: parentid},function(err,result){
        if(result.length>0){
          var childrenArray=[];
          for (var i = 0; i < result.length; i++) {
            childrenArray.push(result[i].subject_name);
          };
          //console.log("result "+result);
          res.send({"response":"Successfull","result":childrenArray});
        }else{
           res.send({"response":"failed no child found"});
        }
      });
    }else{
      res.send({"response":"failed no subject found"});
    }
  });
});

app.post('/addSubjects', function (req, res){


var parentArray=req.body.parent;
//for (var i = 0; i < parentArray.length; i++) {
      
/*gamescoreTable.aggregate([  { $match:{date:{"$gte": d}}},
              { $group:{ _id:'$email', points:{$sum: '$points'} 
                , accuracy:{ $avg:'$accuracy'} 
                ,lastplayed:{ $max:'$date'}}}])
        .sort(parameter)//.skip(2).limit(2)
          .exec(function(err, result) { */

SubjectsTable.aggregate([  { $match:{subject_name:{"$in": parentArray}}}
             ])
          .exec(function(err, result) {

     console.log("result "+result[0].subject_id+" "+result[0].subject_name+" "+result[0]._id);


     var newrow = new SubjectsTable({ 

  subject_id: req.body.id,
  subject_name: req.body.name,
  subject_subtitle: req.body.subtitle,
  subject_image: req.body.image,
  children: req.body.children,
  parent: result[0]._id
    
        });
  newrow.save(function (err) {
    if(err==null){
      console.log("data saved in database"+req.body.id);
      res.send(" saved  in  database");
    }else{
      res.send(" error while saving "+err);
    }
  });
});
/*var newrow = new SubjectsTable({ 

  subject_id: req.body.id,
  subject_name: req.body.name,
  subject_subtitle: req.body.subtitle,
  subject_image: req.body.image,
  children: req.body.children,
  parent: req.body.parent
          //id:request.body.id,
          type : request.body.type,
          category_id :request.body.category_id,
          subcat_id :request.body.subcat_id,
          topic_id : request.body.topic_id,
          expertise :request.body.expertise,
          allowed_exams: request.body.allowed_exams,
          content : request.body.content,
          Options :request.body.Options,

          timed : request.body.timed,
          Hint :   request.body.Hint 


        });
  newrow.save(function (err) {
    if(err==null){
      console.log("data saved in database"+req.body.id);
      res.send(" saved  in  database");
    }else{
      res.send(" error while saving "+err);
    }
  });
*/
});




//simple user register
app.post('/simpleadduser', function (request, response) {
  // create user in req.body 

  var user_type=request.body.user_type;
  var username=request.body.username;
  var password=request.body.password;
  var email=request.body.email;
  console.log("username : "+username);
  ////////////////
  if(!(email.indexOf("@")<1 || email.lastIndexOf(".")<email.indexOf("@")+2 || email.lastIndexOf(".")+2>=email.length)){
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && password.length > 4 && password.match(/[0-9]/) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {

  //var temp =rand(160, 36);
  //var newpass = temp + password;
  //var token = crypto.createHash('sha512').update(email +rand).digest("hex");
  //var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
    var newUser = User({
        user_type: user_type,
    //    token:token,
        username:username,
        //hashed_password:hashed_password
        hashed_password:password,
        email:email
      });

  User.find({email: email},function(err,users){

  var len = users.length;

  if(len == 0){
    newUser.save(function (err) {
    console.log("Sucessfully Registered");
    response.send({"response":"response"});
  });
  }else{
   console.log("Email already Registered");

  }});}else{
    console.log("Password Weak");  
  }}else{
    console.log("Email Not Valid"); 
  }
  /////////////

});

app.post('/loginuser', function (request, response) {

  console.log("request.body.email "+request.body.email);
 // var email = request.body.email;
  var email = "aish@gmail.com";
  //var password = request.body.password;
  var password = "Aish@123";
  console.log("email = "+email+ " password = "+password);
  User.find({email: email},function(err,users){

  if(users.length != 0){

  //var temp = users[0].salt;
  var hash_db = users[0].hashed_password;
  //var id = users[0].token;
  //var newpass = temp + password;
  //var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
  //if(hash_db == hashed_password){
    console.log("cpassword ="+password+" password = "+password);
    if(hash_db == password){
    console.log("Login Sucess");
    response.send({"response":"response"});
  }else{
    console.log("Invalid Password");
  }
  }else {
    console.log("User not exist");
  }
  });
});
// POST /api/users gets JSON bodies 
app.post('/adduser', function (request, response) {
  // create user in req.body 
  var user_type=request.body.user_type;
  var username=request.body.username;
  var facebook_id=request.body.facebook_id;
  var email=request.body.email;
  console.log("user_type : "+user_type);
  var newUser = User({
      user_type: user_type,
      username:username,
      facebook_id:facebook_id,
      email:email
    });

  if(facebook_id != null){
    User.find({facebook_id: facebook_id},function(err,users){

        var len = users.length;

        if(len == 0){
          // add the user 
          newUser.save(function(err) {
            if (err) throw err;
            //session create 
            request.session_state.username = request.body.username;
            request.session_state.isLogedIn=true; 
            console.log(request.session_state.username + ' logged in.'); 
            console.log('Add Facebook User!');
          });
        }else{
         console.log("Facebook user  already SignUp");

        }
        response.send({"response":"response"});
      });
  }else{
    User.find({email: email},function(err,users){

        var len = users.length;

        if(len == 0){
          // add the user 
          newUser.save(function(err) {
            if (err) throw err;
            //session create 
            request.session_state.username = request.body.username;
            request.session_state.isLogedIn=true; 
            console.log(request.session_state.username + ' logged in.'); 
            console.log('Add Gmail User!');
          });
        }else{
         console.log("Gmail user  already SignUp");

        }
       response.send({"response":"response"});
      });
  }
});


var Schema = mongoose.Schema;
var currentindexSchema = mongoose.Schema({ 
  index : Number
});

mongoose.connect('mongodb://aishwarya:aishwarya@ds053597.mongolab.com:53597/freelearn');
var currentIndexData = mongoose.model('currentindex', currentindexSchema); 

app.get('/', function(request, response) {
 response.sendfile("new.html"); 
 
});

app.get('/home', function(request, response) {
 response.sendfile("home.html"); 
 
});

app.get('/a', function(request, response) {
 response.sendfile("a.html"); 
 
});

app.get('/b', function(request, response) {
 response.sendfile("b.html"); 
 
});
app.get('/c', function(request, response) {
 response.sendfile("c.html"); 
 
});

app.get('/choose-test', function(request, response) {
 response.sendfile("choose-test.html"); 
 
});

app.get('/choose-test-get-data', function(request, response) {
  var category=[];
  var subCat=[];
  var Exams=[];
  var ExamsArray=[];
  questionTable.find(function(err,questions){
    if(questions.length!=0){
      questionTable.find().distinct('category_id',function(err,distinctCategory){

        category=distinctCategory;
        console.log("category"+ category);

        questionTable.find().distinct('subcat_id',function(err,distinctSubCat){

          subCat=distinctSubCat;
          console.log("subCat"+ subCat);
          questionTable.find().distinct('allowed_exams',function(err,distinctExam){

            Exams=distinctExam;

            var flags = [], output = [], l = Exams.length, i;
            for( i=0; i<l; i++) {
              if( flags[Exams[i].examname]) continue;
              flags[Exams[i].examname] = true;
              output.push(Exams[i].examname);
            }
            
            console.log("ExamsArray"+  output);
            response.send({"response":"Successfull","category":category,"subCat":subCat,"Exams":output});
          });
        });
      });
    }else{
      console("no questions found");
      response.send({"response":"failed"});
    }
  });

});

app.get('/take-test', function(request, response) {
 response.sendfile('take-test.html');
});

app.post('/getQuestion', function(request, response) {
 //console.log("request body ");
 var type=request.body.type;
 var value=request.body.value;
 var timming=request.body.timming;

 console.log("in  getQuestion "+request.body.value);

   if(type=="Exam"){ 
    console.log("questions for Exams ");
        questionTable.find(function(err,questions){
         
        //console.log("questions "+questions);
        var questionsArray=[];
       for (var i = 0; i < questions.length; i++) {
         var exams=questions[i].allowed_exams;
         for (var j = 0; j < exams.length; j++) {
           if(exams[j].examname==value){
            console.log("mached "+exams[j].examname+i);
            questionsArray.push(questions[i]);
            break;
           }
         };
       };
        console.log("questions *******"+questionsArray);
        response.send({"response":"success","questions":questionsArray});
      });
   }else if(type=="Subject"){
        questionTable.find({category_id:value},function(err,questions){
        console.log("questions "+questions);
        response.send({"response":"success","questions":questions});
      });
   }else if(type=="Topic"){
        questionTable.find({subcat_id:value},function(err,questions){
        console.log("questions "+questions);
        response.send({"response":"success","questions":questions});
      });

   }
 
});

app.get('/new.js', function(request, response) {
 response.sendfile("new.js"); 
 
});

app.post('/exam',function(req,res){

  var level = req.body.level;
  console.log("level"+level);


});

app.get('/22', function(request, response) {
  response.sendfile("main.html"); 

});
app.get('/currentindex', function(request, response) {

 currentIndexData.find(function(err,result){
  if(result.length==0){
    response.send("4");
  }else{
    console.log("got +index"+result[0].index);
    response.send(""+result[0].index);
  }


});
});

//handling file upload

app.post('/api/photo',function(req,res){

  if(done==true){

    console.log(req.files);

    res.json(req.files);
  }

});
app.post('/upload/photo',function(req,res){

  if(done==true){
    var responseAarray=[];
    console.log(req.files.uploadedFile);
    if (req.files.uploadedFile instanceof Array) {
         //   alert('is an array');

         for (var i = 0; i < req.files.uploadedFile.length; i++) {
           responseAarray.push(req.files.uploadedFile[i].path);

         };
         console.log('is an array');
       }else {
            // alert('Not an array');
            responseAarray.push(req.files.uploadedFile.path);
            console.log('Not an array');
          }
          res.send({"array":responseAarray});
        }

      });

app.post('/index', function(request, response) {
 /* console.log(request.body.msg);*/
 currentIndexData.find(function(err,result){
  if(result.length==0){
    var newuser = new currentIndexData({ 
      index:request.body.index,
    });
    newuser.save(function (err) {
      console.log("data saved in database");
    });
  }else{
    result[0].index=request.body.index;
    result[0].save();
    console.log("data saved in database");
  }

  var b=request;
  console.log("in demo"+request.body.index);
  response.send("true"+request.body.index); 
});

 
});
app.get('/demo', function(request, response) {
  console.log("in demo");
  response.send("jhil"); 

});

//mongodb 
app.post('/saveQuestion', function(request, response) {
  console.log("req"+request.body.id);

  var newrow = new questionTable({ 


          //id:request.body.id,
          type : request.body.type,
          category_id :request.body.category_id,
          subcat_id :request.body.subcat_id,
          topic_id : request.body.topic_id,
          expertise :request.body.expertise,
          allowed_exams: request.body.allowed_exams,
          content : request.body.content,
          Options :request.body.Options,

          timed : request.body.timed,
          Hint :   request.body.Hint 


        });
  newrow.save(function (err) {
    if(err==null){
      console.log("data saved in database"+request.body.content.contentfile);
      response.send(" saved  in  database");
    }else{
      response.send(" error while saving "+err);
    }
  });

});

