var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
var colors = require('colors');

var transacted = false; 

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazonDB'
});

connection.connect(function(err) {
  if (err) throw err;
    // console.log('connected, whoop!');
  productsDisplay();
});

function productsDisplay() {
  var query = 'SELECT * FROM products';
  connection.query(query, function(err, res) {

    // table npm package 
    var table = new Table({
        // style: {'padding-left':0, 'padding-right':0, head:[], border:[]},
        head: [colors.green('item_id'), colors.green('product_name'), colors.grey('product_sales'), colors.green('department_name'), colors.green('price'), colors.green('stock_quantity')], 
        colWidths: [10, 30, 16, 20, 10, 18],
        chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' }
    });

    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].item_id + ' | ' + res[i].product_name + ' | ' + res[i].product_sales + ' | ' + res[i].department_name + ' | ' + res[i].price + ' | ' + res[i].stock_quantity); 
      table.push(
          [res[i].item_id, res[i].product_name, colors.grey(res[i].product_sales), res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }

    console.log(table.toString());

    if (!transacted) {
      whatBuy();
    }

  });
  // connection.end();
}

function whatBuy() {
  inquirer
    .prompt([
      {
        name: 'buyId',
        type: 'input',
        message: 'What is the "Item ID" of the product you would like to buy?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please, enter an "Item ID" from the left column.';
        }
      },
      {
        name: 'buyQuantity',
        type: 'input',
        message: 'How many would you like to buy?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
        // console.log('answer.buyId: ' + answer.buyId);
        // console.log('answer.buyQuantity: ' + answer.buyQuantity);
      var query = 'SELECT stock_quantity,price FROM products WHERE item_id = ?';
      connection.query(query, answer.buyId, function(err, res) {
        if (err) throw err;
          // console.log('res[0].stock_quantity: ' + res[0].stock_quantity);
          // console.log('res[0].price: ' + res[0].price);
        if (answer.buyQuantity > res[0].stock_quantity) {
          console.log(colors.bgRed('Insufficient quantity!'));
          console.log('Item #' + answer.buyId + ' only has ' + res[0].stock_quantity + ' remaining.');
          connection.end();
          return;
        } 
        console.log('Placing your order now...');
        newQuantity = res[0].stock_quantity - answer.buyQuantity;
        totalCost = parseFloat(res[0].price * answer.buyQuantity).toFixed(2);
          // console.log('newQuantity: ' + newQuantity);
          // console.log('totalCost: ' + totalCost);
        placeOrder(answer.buyId, newQuantity, totalCost);
      });
    // connection.end();
    });
}

function placeOrder(itemId,newQuant,totalCost) {
  transacted = true;
    // console.log('itemId: ' + itemId);
    // console.log('newQuant: ' + newQuant);
    // console.log('totalCost: ' + totalCost);
            // UPDATE products SET stock_quantity = 0 WHERE item_id = 3
  var query = 'UPDATE products SET ? WHERE ?';
  connection.query(query,
      [
        {
          stock_quantity: newQuant
        },
        {
          item_id: itemId
        }
      ], function(err, res) {
      if (err) throw err;
      console.log('Your total cost will be $' + totalCost + '.');
      productsDisplay();
      connection.end();
  });

  // The query below works, but is not sanitized... 
  // var query = 'UPDATE products SET stock_quantity = ' + newQuant + ' WHERE item_id = ' + itemId;
  // connection.query(query, function(err, res) {
  //     if (err) throw err;
  //     console.log('Your total cost will be $' + totalCost + '.');
  //     productsDisplay();
  //     connection.end();
  // });

}



