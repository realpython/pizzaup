 myApp.controller("PizzaController", ["$scope", "$http", "meetupFactory", "$q", function($scope, $http, meetupFactory, $q) {

  //Globals
  $scope.eventURL = "http://www.meetup.com/Node-js-Denver-Boulder/events/226047336";
  $scope.correctInfo = false;
  $scope.alert = false;

  //Find specific event and create object
  $scope.findEvent = function(url) {
    $scope.alert = false;
    //Validate the URL
    validateURL(url).then(urlResult =>
    {
      if (!urlResult.data.valid)
      {
        //If invalid
        $scope.alertClass = "danger";
        $scope.alertMessage = `${urlResult.data.message} - remember, valid url format is http://www.meetup.com/Node-js-Denver-Boulder/events/226047336.`;
        $scope.alert = true;
      } else {
        //If valid
        $scope.eventInfo = {
          name: urlResult.data.name,
          description: urlResult.data.description,
          attending: urlResult.data.yes_rsvp_count,
          address_name: urlResult.data.venue.name,
          address_street: urlResult.data.venue.address_1.split(',')[0],
          address_city: urlResult.data.venue.city,
          lat: urlResult.data.venue.lat,
          lon: urlResult.data.venue.lon,
        }
        // var eventID = url.split("/").filter(Boolean)[4].toString();
        // meetupFactory.getEvent(eventID)
        //   .success(function(data){
        //     $scope.eventInfo = {
        //       name: data.name,
        //       description: data.description,
        //       attending: data.yes_rsvp_count,
        //       address_name: data.venue.name,
        //       address_street: data.venue.address_1.split(',')[0],
        //       address_city: data.venue.city,
        //       lat: data.venue.lat,
        //       lon: data.venue.lon,
        //       zip_code: '',
        //       expected_ratio: Number,
        //       user_email: String,
        //       user_password: String,
        //       quantities: Array
        //     };
        //   getZip($scope.eventInfo);
          $scope.alert = false;
        }
    })
    .catch(err =>
    {
      console.log('There is an error'); // WTF
    });
  };

  //Determine number of pizzas to order
  $scope.determineQuantity = function(attending, ratio) {
    var totalPizzas = Math.ceil((((parseInt(attending)*ratio)*2)/8));
    var pepQuantity;
    var cheeseQuantity;
    var vegQuantity;
    if (totalPizzas <= 2) {
      pepQuantity = Math.ceil(totalPizzas * (0.4));
      cheeseQuantity = totalPizzas - pepQuantity;
      vegQuantity = 0;
    } else {
      pepQuantity = Math.ceil(totalPizzas * (0.4).toString());
      cheeseQuantity  = Math.floor(totalPizzas * (0.4).toString());
      vegQuantity = totalPizzas - (pepQuantity + cheeseQuantity);
    }
    $scope.pizzaQuantities = [pepQuantity.toString(), cheeseQuantity.toString(), vegQuantity.toString(), totalPizzas.toString()];
    $scope.alert = true;
    $scope.alertClass = 'success';
    $scope.alertMessage = $scope.pizzaQuantities;
    return $scope.pizzaQuantities;
  };

  //Posts object to /data
  $scope.placeOrder = function(info) {
    return meetupFactory.placeOrder($scope.eventInfo);
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
    $scope.alert = true;
    $scope.eventInfo = null;
    $scope.eventURL = "";
    $scope.alertClass = "danger";
    $scope.alertMessage = 'Please resubmit the Meetup link and/or verify that the Meetup page lists a valid address!';
  };


// helper functions

// validate the user supplied URL
function validateURL(url) {
  const deferred = $q.defer();

  splitURL = url.split("/").filter(Boolean);
  if (splitURL.length !== 5) {
    deferred.resolve({
      data: {valid: false, message: "Invalid URL Format"}
    })
  }
  else if (!splitURL[0].match('http')) {
    deferred.resolve({
      data: {valid: false, message: "Invalid Protocol"}
    })
  }
  if (splitURL[1] !== 'www.meetup.com') {
    deferred.resolve({
      data: {valid: false, message: "Invalid Host specified"}
    })
  }
  if (splitURL[3] !== 'events') {
    deferred.resolve({
      data: {valid: false, message: "Invalid URL structure"}
    })
  }
  if (isNaN(parseInt(splitURL[4]))) {
    deferred.resolve({
      data: {valid: false, message: "Invalid URL specified"}
    })
  }
  $http.post("/validate", {url: url}).then(deferred.resolve).catch(deferred.reject);
  return deferred.promise;
}

//return zip from lat/long
function getZip(eventInfo) {
  meetupFactory.getZip({lat: eventInfo.lat, lon: eventInfo.lon})
  .success(function(data){
    eventInfo.zip_code = data;
  })
  .error(function(err) {
    console.log('There is an error');
  });
}


}]);
