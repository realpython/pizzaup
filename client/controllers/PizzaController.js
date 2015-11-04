myApp.controller("PizzaController", ["$scope", "$http", "meetupFactory", function($scope, $http, meetupFactory) {

  $scope.eventURL = "";
  $scope.correctInfo = false;
  $scope.incorrectInfo = false;

  //Find specific event and create object
  $scope.findEvent = function() {
    $scope.eventID = $scope.eventURL.split("/").slice(-2,-1).toString();
    meetupFactory.getEvent($scope.eventID)
      .success(function(data){
        $scope.eventInfo = {
          name: data.name,
          description: data.description,
          attending: data.yes_rsvp_count,
          address_name: data.venue.name,
          address_street: data.venue.address_1.split(',')[0],
          address_city: data.venue.city,
          lat: data.venue.lat,
          lon: data.venue.lon,
          zip_code: '',
          expected_ratio: Number,
          user_email: String,
          user_password: String,
          quantities: Array
        };
      $scope.getZip($scope.eventInfo);
      $scope.incorrectInfo = false;
    })
    .error(function(err){
      console.log('There is an error');
    });
  };

  //posts object to /data
  $scope.placeOrder = function(info) {
    return meetupFactory.placeOrder($scope.eventInfo);
  };

  //return zip from lat/long
  $scope.getZip = function(eventInfo) {
    meetupFactory.getZip({lat: eventInfo.lat, lon: eventInfo.lon})
    .success(function(data){
      eventInfo.zip_code = data;
    })
    .error(function(err) {
      console.log('There is an error');
    });
  };

  $scope.determineQuantity = function (attending, ratio) {

    var totalPizzas = Math.ceil((((parseInt(attending)*ratio)*2)/8));

    if (totalPizzas <= 2) {
      var pepQuantity = Math.ceil(totalPizzas * (0.4));
      var cheeseQuantity = totalPizzas - pepQuantity;
      var vegQuantity = 0;

    } else {
      var pepQuantity = Math.ceil(totalPizzas * (0.4).toString());
      var cheeseQuantity  = Math.floor(totalPizzas * (0.4).toString());
      var vegQuantity = totalPizzas - (pepQuantity + cheeseQuantity);
    }

    $scope.pizzaQuantites = [pepQuantity.toString(), cheeseQuantity.toString(), vegQuantity.toString(), totalPizzas.toString()];

    return $scope.pizzaQuantites;

  };

  //Add DPC username and password + expected attendance ratio to event object
  $scope.addUser = function () {
    $scope.eventInfo.user_email = $scope.email;
    $scope.eventInfo.user_password = $scope.password;
    $scope.eventInfo.expected_ratio =  parseFloat($scope.expectedRatio);
    $scope.eventInfo.quantities = $scope.determineQuantity($scope.eventInfo.attending, $scope.eventInfo.expected_ratio);
    console.log($scope.eventInfo);
  };

  //Confirm Event Info
  $scope.confirmInfo = function () {
    $scope.correctInfo = true;
  };

  //Reject Event Info
  $scope.denyInfo = function () {
    $scope.incorrectInfo = true;
    $scope.eventInfo = null;
    $scope.eventURL = "";
  };


}]);
