//dependencies
var express = require('express');
var router = express.Router();
var request = require("request");
var pizzapi = require('dominos');
var Address = require('dominos').Address;
var Customer = require('dominos').Customer;
var Store = require('dominos').Store;
var findStoreID = require('../../dominos.js').findStoreID;
var createCustomer = require('../../dominos.js').createCustomer;
var addItems = require('../../dominos.js').addItems;
var createOrder = require('../../dominos.js').createOrder;
var createStore = require('../../dominos.js').createStore;
var pymtOrder = require('../../dominos.js').pymtOrder;
var createCard = require('../../dominos.js').createCard;
var addPymt = require('../../dominos.js').addPymt;
var meetup = require('../bin/meetup.js');

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

// validate the meetup url
router.post('/validate', async function(req, res, next) {
  res.send(await meetup({
    url: req.body.url,
    token: config.meetupkey
  }));
});

// dominos code
router.post('/data', function(req, res, next){
  var meetupInfo = req.body;
  var pepQuan = meetupInfo.quantities[0];
  var hwnQuan = meetupInfo.quantities[1];
  var vegQuan = meetupInfo.quantities[2];
  var address = meetupInfo.address_street+', '+meetupInfo.address_city+', '+'CO, '+ meetupInfo.zip_code;
  var newCustomer = createCustomer(address, 'Michael', 'Herman', '8675309', 'sample@sample.org');

  pizzapi.Util.findNearbyStores(address,
    'Delivery',
    function (data){
      //returns store obj
      var myStore = createStore(data.result.Stores[0].StoreID);
      var order = createOrder(newCustomer, myStore.ID);
      addItems(order, pepQuan, hwnQuan, vegQuan);
      var cardInfo = createCard(order, '0000000000000000', '0116', '000', '80206');
      var payment = addPymt(order, cardInfo);
    });
  });

  module.exports = router;
