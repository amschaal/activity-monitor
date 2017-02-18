angular.module('yaam.services', [])

.factory('Activity', function($interval,$rootScope) {
	var callbacks = {};
	var data = [];
	var activity = null;
	var gWatchID = null;
	var gOptions = { frequency: 250 }; 
	var stats = {};
	var random = d3.randomNormal(0, 10);
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
				gOptions);
		}else
			gWatchID = $interval(generateData,gOptions.frequency);
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
	return {
		types: function() {
			return ['walk','bike'];
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
			clearActivity();
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
});
