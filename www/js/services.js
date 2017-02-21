angular.module('yaam.services', [])

.factory('Activity', function($interval,$rootScope,$http) {
	var callbacks = {};
	var data = [];
	var activity = null;
	var gWatchID = null;
	//var gOptions = { frequency: 250 }; 
	var stats = {};
	var random = d3.randomNormal(0, 10);
	var uploadURL = '/api/activities/upload/';
	var typesURL = '/api/activities/types/';
	var types = [];
	$http.get(getAPIURL()+typesURL).then(function(response){
				types = response.data;
			},function(){
				console.log('Unable to load types');			
			});
	function accelUpdate(acceleration) {
		data.push(acceleration);		
		acceleration.magnitude = Math.sqrt(acceleration.x*acceleration.x+acceleration.y*acceleration.y+acceleration.z*acceleration.z)        
		stats.acceleration = acceleration;
		stats.accelAvgMag = d3.mean(data,function(d){return d.magnitude});
		notify();
	}
	function watch() {
		console.log('watch');
		if (navigator && navigator.accelerometer){
			navigator.accelerometer.getCurrentAcceleration(accelUpdate, function() {alert("Couldn't get acceleration");});
			gWatchID = navigator.accelerometer.watchAcceleration(accelUpdate,
				function() {
				    alert("Couldn't watch acceleration");
				},
				{frequency:getFrequency()});
		}else
			gWatchID = $interval(generateData,getFrequency());
		stats.gWatchID = gWatchID;
	};
	function clearWatch() {
		if (navigator && navigator.accelerometer)
			navigator.accelerometer.clearWatch(gWatchID);
		else
			$interval.cancel(gWatchID);
		stats.gWatchID = gWatchID = null;			
	};
	function clearActivity(){
		clearWatch();
		data.length = 0;
		activity = null;
		delete stats.acceleration;
		delete stats.accelAvgMag;
		delete stats.activity;
		delete stats.gWatchID;
	};
	function generateData(){
		var acceleration = {x:random(),y:random(),z:random()};
		acceleration.magnitude = Math.sqrt(acceleration.x*acceleration.x+acceleration.y*acceleration.y+acceleration.z*acceleration.z)        
		stats.acceleration = acceleration;
		stats.accelAvgMag = d3.mean(data,function(d){return d.magnitude});
		data.push(acceleration)
		notify();
	}
	function notify(){
		for (var id in callbacks) {
		    if (callbacks.hasOwnProperty(id)) {
			callbacks[id](data);
		    }
		} 
	}
	function getAPIURL(){
		var url = window.localStorage.getItem('api_url');
		return url ? url : 'http://127.0.0.1:5000';
	}
	function getFrequency(){
		var frequency = window.localStorage.getItem('frequency');
		return frequency ? frequency : 50;
	}
	return {
		types: function() {
			return types;
		},
		pause: function(){
			clearWatch();		
		},
		resume: function(){
			watch();
		},
		save: function() {
			//save data
			console.log('save',data);
			//var result = DB.saveActivity({'type':activity,'data':data});
			$http.post(getAPIURL()+uploadURL, {'type':activity,'data':data}).then(function(){
				clearActivity();
			},function(){
				console.log('Unable to upload activity data');			
			});
			
		},
		clear: clearActivity,
		startActivity(type){
			stats.activity = activity = type;
			watch();
		},
		//    addDatum: function(datum){
		//	data.push(datum);
		//    },
		getData: function(){
			return data;
		},
		getStats: function(){
			return stats;
		},
		watchData: function(func){
			var index = random();
			callbacks[index]=func;
			return index;
		},
		clearWatcher: function(index){
			if (callbacks[index])
				delete callbacks[index];
		}
	};
})
.factory('DB', function() {
	/*
	console.log('start db');
	var userID = 'user123';  //this will come from elsewhere at somepoint	
	var config = {
	    apiKey: "AIzaSyAZ5d6Rf55zMQv33EAeJwdJwnAeNmUC3hE",
	    authDomain: "yaam-bc02f.firebaseapp.com",
	    databaseURL: "https://yaam-bc02f.firebaseio.com",
	    storageBucket: "yaam-bc02f.appspot.com",
	    messagingSenderId: "311205090986"
	  };
	  firebase.initializeApp(config);
	  var activityList = firebase.database().ref('users/' + userID+'/raw/');
	return {
		types: function() {
			return ['walk','bike'];
		},
		saveActivity(activity){
			var newActivityRef = activityList.push();
			// we can get its id using key()
			console.log('activity key'+newActivityRef.key);
			// now it is appended at the end of data at the server
			return newActivityRef.set(activity);
		}
	};
*/
});


