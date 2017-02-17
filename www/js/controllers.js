angular.module('yaam.controllers', [])

.controller('DashCtrl', function($scope) {
	var yaam = this;
	yaam.gWatchID = null;
	var gOptions = { frequency: 50 }; 
	yaam.foo='bar';		    
	function accelUpdate(acceleration) {
		acceleration.magnitude = Math.sqrt(acceleration.x*acceleration.x+acceleration.y*acceleration.y+acceleration.z*acceleration.z)        
		data.push(acceleration);
		yaam.acceleration = acceleration;
		yaam.accelAvgMag = d3.mean(data,function(d){return d.magnitude});
		draw();
	}
	yaam.watch = function onDeviceReady() {
		console.log('watch');
		navigator.accelerometer.getCurrentAcceleration(accelUpdate, function() {alert("Couldn't get acceleration");});
		yaam.gWatchID = navigator.accelerometer.watchAcceleration(accelUpdate,
			function() {
			    alert("Couldn't watch acceleration");
			},
			gOptions);
		};
	yaam.clearWatch = function() {
		navigator.accelerometer.clearWatch(yaam.gWatchID);
		yaam.gWatchID = null;
	};

})

.controller('SettingsCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.saveActivities = function() {
    
  };
})
.controller('ChartCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	var n = 200,
	    random = d3.randomNormal(0, 10),
	    data = [];//d3.range(n).map(random);

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

	function draw() {
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
		draw();
	}
//generateData();

});
