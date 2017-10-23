var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require('colors');

// item_id
// product_name
// product_sales
// department_name
// price
// stock_quantity

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazonDB'
});

connection.connect(function(err) {
  if (err) throw err;
    console.log('connected, whoop!');
  initProductsDisplay();
});

// table package 
var table = new Table({
    head: ['item_id', 'product_name', 'product_sales', 'department_name', 'price', 'stock_quantity'], 
    colWidths: [10, 30, 16, 20, 10, 18],
    chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' }
});

function initProductsDisplay() {
  var query = 'SELECT * FROM products';
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].item_id + ' | ' + res[i].product_name + ' | ' + res[i].product_sales + ' | ' + res[i].department_name + ' | ' + res[i].price + ' | ' + res[i].stock_quantity); 
      table.push(
          [res[i].item_id, res[i].product_name, res[i].product_sales, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }
    console.log(table.toString());
    // runSearch();
  });
  connection.end();
}


