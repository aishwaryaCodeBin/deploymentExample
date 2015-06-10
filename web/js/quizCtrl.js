/**
 * Created by manas on 08-06-2015.
 */
/*
var history_api = typeof history.pushState !== 'undefined';
// history.pushState must be called out side of AngularJS Code
if ( history_api ) history.pushState(null, '', '#StayHere');  */



var skoolersQuiz = angular.module('skoolersQuiz', ['ui.router']);

skoolersQuiz.directive('questionOptions',function(){
  
 
  return{
    restrict:'E',
    templateUrl:"views/options1.html"
  };

});


skoolersQuiz.directive('questionOptionsTwo',function(){
  
 
  return{
    restrict:'E',
    templateUrl:"views/options2.html"
  };

});


skoolersQuiz.factory('Data', ['$rootScope', function($rootScope){
  var data =
  {
    Question: ''
  };
var questionNumber =
  {
    QuestionNum: ''
  };
var result=
{
	resultArray:[]
};

  return {

    getFirstName: function () {
      return data.Question;
    },
    setFirstName: function (Question) {
      data.Question = Question;
    },
    getQuesNum: function () {
      return questionNumber.QuestionNum;
    },
    setQuesNum: function (Num) {
      questionNumber.QuestionNum = Num;
    },
    getResult: function () {
      return result.resultArray;
    },
    setResult: function (value) {
      result.resultArray.push(value);
    }

  };
}]);
/*skoolersQuiz.run(function($rootScope, $location){
               $rootScope.$on('$stateChangeStart', function(event, next, current){
                console.log("******stateChangeStart*******"+event);
                //event.preventDefault();
                console.log("******affter preventDefault*******"+event);
                /*if (next.$$route.controller != "quizCtrl") {
            // Show here for your model, and do what you need**
            alert("a");
        }*/
                  /* if(!$rootScope.loggedUser) { 
                       $location.path('/register');
                   }*
               });
    $rootScope.$on('$locationChangeSuccess', function(){
      //  $rootScope.actualLocation = $location.path();
    });

    $rootScope.$watch(function() {return $location.path()}, function(newLocation, oldLocation){
        if($rootScope.actualLocation == newLocation){
           // $location.path('/register');
        }
    });

           });*/
/*skoolersQuiz.run(function($rootScope, $route, $location){
   //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to 
   //bind in induvidual controllers.

   $rootScope.$on('$locationChangeSuccess', function() {
    console.log("locationChangeSuccess");
        $rootScope.actualLocation = $location.path();
    });        

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
       console.log("locationChangeSuccess2");
        if($rootScope.actualLocation === newLocation) {
            alert('Why did you use history back?');
        }
    });
});*/
skoolersQuiz.controller('quizCtrl', function ($scope,$location,$http,Data,$document) {
/*
$scope.$on('$locationChangeStart', function(event, next, current){            
    // Here you can take the control and call your own functions:
    alert('Sorry ! Back Button is disabled');
    // Prevent the browser default action (Going back):
    //event.preventDefault();            
});*/
/*$scope.$on('$routeChangeStart', function (scope, next, current) {
  alert("haha");
  console.log("in route change");
        if (next.$$route.controller != "Your Controller Name") {
            // Show here for your model, and do what you need**
            $("#yourModel").show();
        }
    });
*/

//$location.path("/quiz2");
//get the questions here.
//check for the queation type .
//call the view quizX accordingly


$scope.startTime=function(time){
  console.log("in startTime");

  var skillBar=document.getElementsByClassName("inner");
  console.log("skillBar "+skillBar);
  //var skillVal = skillBar.attr("data-progress");
    $(skillBar).animate({
        height: '100%'
    }, time, function(){
      console.log("in timer finish");
      $scope.$apply(function(){
        $scope.nextQuestion();
      $(skillBar).height(0);
    });
       
        //$(skillBar).height='100%';
    });
}
$scope.init=function(){
 var InputJson={"type":"Exam","value":"JEE","timming":"regular"};
 $http.post('/getQuestion',InputJson).success(function(data){
        console.log("data.getQuestion: "+data.questions[0].type);
        Data.setFirstName( JSON.stringify(data.questions));
        $scope.QuesData=data.questions;
        console.log($scope.QuesData);
        $scope.getQues();
});
  $scope.Quesnumber=0;
  Data.setQuesNum(0);
$scope.quiz={question:"",options:[],type:""};
}

$scope.quiz={question:"",options:[],type:""};

$scope.quizinit=function(){
	console.log("in quiz1 ");
	$scope.QuesData=JSON.parse(Data.getFirstName());
	$scope.Quesnumber=Data.getQuesNum();
	console.log("question data "+$scope.QuesData);
	console.log($scope.QuesData[$scope.Quesnumber].type);
	$scope.getQues();
}
$scope.getChar=function(n){

return String.fromCharCode(97 + n);
}

$scope.getQues=function(){
	
	 console.log("$scope.QuesData "+$scope.QuesData.length);
console.log($scope.QuesData[$scope.Quesnumber].type);
if($scope.QuesData[$scope.Quesnumber].type=="single_opt"){
	$scope.quiz.answer="";
  $scope.quiz.type="single_opt";
	$location.path("/quiz1");

}else if($scope.QuesData[$scope.Quesnumber].type=="mult_option"){
	$scope.quiz.answer=[];
  $scope.quiz.type="mult_option";
	$location.path("/quiz2");
	  $scope.candidateAnswers = {}; 
}
$scope.quiz.question=$scope.QuesData[$scope.Quesnumber].content;
var options=$scope.QuesData[$scope.Quesnumber].Options;
for (var i = 0; i < options.length; i++) {
		
		$scope.quiz.options.push({option:options[i].option,answer:i});
};
    
$scope.startTime(10*1000);
}


  $scope.candidateAnswers = {}; 
$scope.send = function() {
    $scope.quiz.answer = [];
    for (var k in $scope.candidateAnswers) {
      if ($scope.candidateAnswers[k].selected) {
        $scope.quiz.answer.push(parseInt(k));
      }
    };
  }
$scope.checkAnswer=function(){
console.log(" in check answer"+$scope.quiz.answer);

if($scope.QuesData[$scope.Quesnumber].type=="single_opt"){
	//$scope.quiz.answer="";
	if($scope.QuesData[$scope.Quesnumber].Options[$scope.quiz.answer]!=undefined){
//console.log("in single_opt "+$scope.QuesData[$scope.Quesnumber].Options[$scope.quiz.answer].value);
if($scope.QuesData[$scope.Quesnumber].Options[$scope.quiz.answer].value=="correct"){
	Data.setResult(true);
}else{
	Data.setResult(false);
}}else{
	Data.setResult(false);
}

}else if($scope.QuesData[$scope.Quesnumber].type=="mult_option"){
	//$scope.quiz.answer=["h","h","h","h","h"];
	var answerArray=[];
	
	for (var i = 0; i < $scope.QuesData[$scope.Quesnumber].Options.length; i++) {
		if($scope.QuesData[$scope.Quesnumber].Options[i].value=="correct"){
			answerArray.push(i);

		}
	};
	console.log("in mult_option "+answerArray);

	if(answerArray.sort().join(',')===$scope.quiz.answer.sort().join(',')){
		console.log(true);
		Data.setResult(true);
	}else{
		console.log(false);
	Data.setResult(false);
}
}

};
$scope.nextQuestion= function(){
	$scope.checkAnswer();
	console.log("in nextQuestion");
	 $scope.Quesnumber++;
	 Data.setQuesNum($scope.Quesnumber);
	 $scope.quiz={question:"",options:[],type:""};
	 $scope.QuesData=JSON.parse(Data.getFirstName());
	 console.log("$scope.Quesnumber "+$scope.Quesnumber);
if($scope.Quesnumber<$scope.QuesData.length){
 $scope.getQues();
}else{
	console.log("Result "+Data.getResult());
}

	
}

});


 skoolersQuiz.config(function($stateProvider, $urlRouterProvider) {

 	 $urlRouterProvider.otherwise("/quiz");
  // Now set up the states
  $stateProvider
  .state('quiz', {
    url: "/quiz",
    templateUrl: "views/quiz.html"
  }).state('progressbar', {
    url: "/progressbar",
    templateUrl: "views/progressbar.html"
  })
  .state('quiz1', {
    url: "/quiz1",
    templateUrl: "views/quiz1.html"
  })
   .state('quiz2', {
    url: "/quiz2",
    templateUrl: "views/quiz2.html"
  })

  
  
});