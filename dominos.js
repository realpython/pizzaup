var pizzapi = require('dominos');
var Address = require('dominos').Address;
var Customer = require('dominos').Customer;
var Store = require('dominos').Store;

//create store fn
function createStore(id){
    var myStore = new pizzapi.Store({ID: id});
    console.log(myStore);
    return myStore;
}

//creates address and then customer object
function createCustomer(address, firstName, lastName, phone, email){
  var fullAddress = new Address(address);
   var newCustomer = new Customer(
        {
          address: fullAddress,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email
        });
    return newCustomer;
      }

//creates and returns new order with customer and store
function createOrder(customer, id){
        var order = new pizzapi.Order(
        {
          customer: customer,
          storeID: id,
          deliveryMethod: 'Delivery'
        });
        return order;
}

//adds items to order
function addItems(order, pepQuan, hwnQuan, vegQuan){
  order.addItem(new pizzapi.Item(
        {
         code: 'P_16SCREEN',
         options: [],
         quantity: +pepQuan
        }));
  order.addItem(new pizzapi.Item(
       {
        code: 'HN_16SCREEN',
        options: [],
        quantity: +hwnQuan
      }));
  order.addItem(new pizzapi.Item(
      {
       code: 'P_16IREPV',
       options: [],
       quantity: +vegQuan
    }));
  console.log(order);
}

//pay and place order
//payment info
function createCard(order, cardNum, exp, secCode, zip){
var cardInfo = new order.PaymentObject();
cardInfo.Number = cardNum;
cardInfo.Expiration = exp;//  01/15 just the numbers "01/15".replace(/\D/g,'');
cardInfo.SecurityCode = secCode;
cardInfo.PostalCode = zip; // Billing Zipcode
return cardInfo;
}

function addPymt(order, cardInfo){
  cardInfo.Amount = order.Amounts.Customer;
  cardInfo.CardType = order.validateCC(cardInfo);
order.Payments.push(cardInfo);
return order.place(
  function(result) {
    console.log("Order placed!");
  });
}

module.exports = {
  createStore:createStore,
  createCustomer:createCustomer,
  createOrder:createOrder,
  addItems:addItems,
  createCard:createCard,
  addPymt:addPymt
};
