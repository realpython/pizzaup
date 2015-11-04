//dependencies
var express = require('express');
var router = express.Router();
var request = require("request");
var pizzapi = require('dominos');
var Address = require('dominos').Address;
var Customer = require('dominos').Customer;
var Store = require('dominos').Store;

// constants
var meetupBaseURL = 'https://api.meetup.com/2/events?';
var googleBaseURL = 'http://maps.googleapis.com/maps/api/geocode/json?';

// config
var config = require('../_config');
var meetupkey = config.meetupkey;


// get meetup event info
router.get('/data/:id', function(req, res, next) {
  var url = meetupBaseURL + 'key='+meetupkey+'&event_id='+req.params.id+'&sign=true';
  request(url, function(error, data) {
    if (error) {
      res.send("Something went wrong!");
    }
    res.send(JSON.parse(data.body).results[0]);
  });
});

// get zip code based on lat/long
router.post('/zip', function(req, res, next) {
  var url = googleBaseURL + 'latlng='+req.body.lat+','+req.body.lon;
  request(url, function(error, data) {
    if (error) {
      res.send("Something went wrong!");
    }
    res.send(JSON.parse(data.body).results[0].address_components[7].short_name);
  });
});


// dominos lib code
router.post('/data', function(req, res, next){
  var meetupInfo = req.body;
  var address = meetupInfo.address_street+', '+meetupInfo.address_city+', '+'CO, '+ meetupInfo.zip_code;
  pizzapi.Util.findNearbyStores(address,
    'Delivery',
    function(data){
      // console.log(data.result.Stores[0].StoreID);
      myStore = new pizzapi.Store(
        {
          ID: data.result.Stores[0].StoreID
        }
      );
      myStore.getMenu(
        function(storeData) {
          // console.log('\n\n##################\nClosest Store Menu\n##################\n\n',storeData.result);
        }
      );

      var firstStoreID = data.result.Stores[0].StoreID;
      var fullAddress = new Address(address);
      var mHerman = new Customer(
        {
          address: fullAddress,
          firstName: 'Michael',
          lastName: 'Herman',
          phone: '1-800-The-White-House',
          email: 'br'
        }
      );
      var order = new pizzapi.Order(
        {
          customer: mHerman,
          deliveryMethod: 'Delivery',
          storeID: firstStoreID
        }
      );
      order.addItem(new pizzapi.Item(
        {
          code: 'P_16SCREEN',
          options: [],
          quantity: +meetupInfo.quantities[0]
        }
      )
    );
    order.addItem(new pizzapi.Item(
      {
        code: 'HN_16SCREEN',
        options: [],
        quantity: +meetupInfo.quantities[1]
      }
    )
  );
  order.addItem(new pizzapi.Item(
    {
      code: 'P_16IREPV',
      options: [],
      quantity: +meetupInfo.quantities[2]
    }
  )
);
console.log(order);
}
);
});

module.exports = router;
