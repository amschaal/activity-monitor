angular.module('yaam.controllers', ['yaam.services'])

.controller('DashCtrl', function($scope, $ionicActionSheet,Activity) {
	var yaam = $scope;
	yaam.stats = Activity.getStats();
	yaam.data = Activity.getData();
	yaam.startActivity = function() {
		console.log('show');
	   // Show the action sheet
	   var hideSheet = $ionicActionSheet.show({
	     buttons: Activity.types().map(function(activity){
			return {text: activity,activity: activity};		
		}),
/*[
	       { text: '<b>Share</b> This' },
	       { text: 'Move' }
	     ]*/
//	     destructiveText: 'Delete',
	     titleText: 'Start an activity',
	     cancelText: 'Cancel',
	     cancel: function() {
		console.log('cancel');
		  // add cancel code..
		},
	     buttonClicked: function(index,choice) {
		console.log(index,choice.activity);
		Activity.startActivity(choice.activity);
	       return true;
	     }
	   });
	  }
	yaam.resumeActivity =function(){
		Activity.resume();
	};
	yaam.stopActivity = function() {
		console.log('show');
		Activity.pause();
	   // Show the action sheet
	   var hideSheet = $ionicActionSheet.show({
	     buttons: 
		[
	       { text: 'Save',action:'save' },
	       { text: 'Pause',action:'pause' }
	     ],
	     destructiveText: 'Delete',
	     titleText: 'Save your activity',
	     cancelText: 'Cancel',
	     cancel: function() {
		console.log('cancel');
		Activity.resume();
		},
	     destructiveButtonClicked: function(){
		Activity.clear();
		return true;
		},
	     buttonClicked: function(index,choice) {
		switch(choice.action){
			case 'save':
				Activity.save();
			case 'pause':
				Activity.pause();
		}
	       return true;
	     }
	   });
	  }

})

.controller('SettingsCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.activities=[];
  $scope.api_url = window.localStorage.getItem('api_url');
  $scope.addActivity = function(activity){
		console.log('add',activity);	
	if (activity && activity.length > 2)
		$scope.activities.push(activity);
//	$scope.new_activity = null;
  }
  $scope.saveActivities = function() {
  };
  $scope.setAPIURL = function(URL){
	window.localStorage.setItem('api_url', URL);
  };
  $scope.setFrequency = function(frequency){
	window.localStorage.setItem('frequency', frequency);
  };
  
})
.controller('ChartCtrl', function($scope,Activity) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
	var watcher = null;
	$scope.$on('$ionicView.enter', function(e) {
		console.log('enter');
		if (!watcher)
			watcher = Activity.watchData(draw);		
	});
	$scope.$on('$ionicView.leave', function(e) {
		console.log('leaving');
		Activity.clearWatcher(watcher);
		watcher = null;	
	});

	


	var n = 200,
	    random = d3.randomNormal(0, 10);//d3.range(n).map(random);

	var svg = d3.select("svg"),
	    margin = {top: 20, right: 20, bottom: 20, left: 40},
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height") - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleLinear()
	    .domain([0, n - 1])
	    .range([0, width]);

	var y = d3.scaleLinear()
	    .domain([-25, 25])
	    .range([height, 0]);

	var xLine = d3.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d) { return y(d.x); });
	var yLine = d3.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d) { return y(d.y); });
	var zLine = d3.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d) { return y(d.z); });


	g.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height);

	g.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + y(0) + ")")
	    .call(d3.axisBottom(x));

	g.append("g")
	    .attr("class", "axis axis--y")
	    .call(d3.axisLeft(y));

	g.append("g")
	    .attr("clip-path", "url(#clip)")
	    .attr('class','lines');

	function draw(data) {
	   if (data.length > n)
		data.shift();
	   svg.selectAll('.lines g').remove(); 
	//    .attr("clip-path", "url(#clip)")
	  svg.selectAll('.lines').append('g').append("path")
	    .datum(data)
	    .attr("class", "x-line")
	    .attr("stroke", "steelblue")
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("stroke-width", 1.5)
	      .attr("d", xLine)
	      .attr("transform", "translate(" + x(n-data.length) + ",0)");
	   svg.selectAll('.lines').append('g').append("path")
	    .datum(data)
	    .attr("class", "y-line")
	    .attr("stroke", "red")
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("stroke-width", 1.5)
	      .attr("d", yLine)
	      .attr("transform", "translate(" + x(n-data.length) + ",0)");
	   svg.selectAll('.lines').append('g').append("path")
	    .datum(data)
	    .attr("class", "z-line")
	    .attr("stroke", "orange")
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("stroke-width", 1.5)
	      .attr("d", zLine)
	      .attr("transform", "translate(" + x(n-data.length) + ",0)");
	}
	$scope.generateData = function(){
		data.push({x:random(),y:random(),z:random()})
	//	console.log('data',data);
		//setTimeout(generateData,500);
		//draw();
	}
//generateData();

});
