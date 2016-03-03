var app = angular.module('sms' , ['ngFileUpload']);

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

    $scope.toggleStatus = function(message , status){
    	message.activated = status;

		$http.put('/message/' + message._id , message).then(function(response){
	        message.activated = response.data.activated;
	    });
	}

});
app.controller('uploadCtrl' , function($scope , $http , Upload , $timeout){
	$scope.images = [];
	$scope.file_ = {}

    $http.get("imageList").then(function(response){
        if(response && response.data){
            $scope.images = response.data;
        }  
    })
	$scope.submit = function(){
		for(var i=0 ; i < $scope.images.length ; i++){
            if($scope.images[i].name == $scope.name.toLowerCase()){
                alert("Name already exists");
                return;
            }
        }

        if ($scope.upload_form.file.$valid && $scope.file_.file) { //check if from is valid
            alert("Uploading image please wait...")
            $scope.upload($scope.file_.file , $scope.name); //call upload function
        }
	}

	$scope.upload = function (file , name) {
        $scope.loading = true;
        Upload.upload({
            url: '/upload', 
            data:{file:file , name : name} 
        }).then(function (resp) { 
            $scope.loading = false;
            if(resp && resp.status == 200){ //validate success
                $scope.images.push(resp.data);
                alert("Image successfully uploaded.")
            } else {
                alert('an error occured');
            }
        })
    };

    $scope.delete = function(image){
        $http.delete("/images/" + image._id).then(function(response){
            if(response){
                var index = $scope.images.indexOf(image);
                $scope.images.splice(index , 1);
            }  
        })
    }
})

app.controller('userUploadCtrl' , function($scope , $http , Upload , $timeout){
    $scope.file_ = {};
    $scope.images = [];
    $http.get("imageList").then(function(response){
        if(response && response.data){
            $scope.images = response.data;
        }  
    })
    $scope.submit = function(){
        for(var i=0 ; i < $scope.images.length ; i++){
            if($scope.images[i].name == $scope.name.toLowerCase()){
                alert("Name already exists");
                return;
            }
        }

        if ($scope.upload_form.file.$valid && $scope.file_.file) { //check if from is valid
            alert("Uploading image please wait...")
            $scope.upload($scope.file_.file , $scope.name , $scope.station_id); //call upload function
        }
    }

    $scope.upload = function (file , name , station_id ) {
        $scope.loading = true;
        Upload.upload({
            url: '/userUpload', 
            data:{file:file , name : name , station_id } 
        }).then(function (resp) { 
            $scope.loading = false;
            if(resp && resp.status == 200){ //validate success
                $scope.images.push(resp.data);
                alert("Image successfully uploaded.")
            } else {
                alert('an error occured');
            }
        } , function(error){
            alert(error.data.message);
        })
    };
})