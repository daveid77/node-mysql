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
  managerOptions();
});

function managerOptions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product',
        ]
      }
    ])
    .then(function(answer) {
      console.log(colors.green(answer.action));
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;
      }
    });
}

function viewProducts() {
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

function viewInventory() {
  console.log(colors.red('viewInventory'));
  connection.end();
}

function addInventory() {
  console.log(colors.red('addInventory'));
  connection.end();
}

function addProduct() {
  console.log(colors.red('addProduct'));
  connection.end();
}



