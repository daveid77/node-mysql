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
  console.log(colors.red('viewProducts'));
  connection.end();
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



