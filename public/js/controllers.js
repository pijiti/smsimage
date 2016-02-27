var app = angular.module('sms' , []);

app.controller('stationController' , function($scope , $http){
	$scope.admin = {};
	$scope.station_admins = [];

	$http.get('/adminList').then(function(response){
        if(response && response.data){
            $scope.station_admins = response.data;
        }  
    });

	$scope.create = function(){
		$http.post('/admin' , $scope.admin).then(function(response){
			$scope.error = false;
			$scope.station_admins.push(response.data)
		} , function(error){
			$scope.error = error.data.message;
		});
	}

	$scope.toggleActive = function(station_admin){
		$http.put('/admin/' + station_admin._id , station_admin).then(function(response){
	        station_admin.activated = response.activated;
	    });
	}
});

app.controller('messageController' , function($scope , $http){
	$scope.admin = {};
	$scope.messages = [];

	$http.get('/messageList').then(function(response){
        if(response && response.data){
            $scope.messages = response.data;
        }  
    });

});