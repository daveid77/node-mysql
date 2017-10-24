var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
var colors = require('colors');

var addInv = false;
var newQuantity = 0;

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazonDB'
});

connection.connect(function(err) {
  if (err) throw err;
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
        // console.log(colors.green(answer.action));
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          viewProducts(addInv);
          break;

        case "Add New Product":
          addProduct();
          break;
      }
    });
}


function viewProducts(addInv) {
  var query = 'SELECT * FROM products';
  connection.query(query, function(err, res) {

    // cli-table2 npm package
    var table = new Table({
        head: [colors.green('item_id'), colors.green('product_name'), colors.grey('product_sales'), colors.green('department_name'), colors.green('price'), colors.green('stock_quantity')], 
        colWidths: [10, 30, 16, 20, 10, 18],
        chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' }
    });

    for (var i = 0; i < res.length; i++) {
      table.push(
          [res[i].item_id, res[i].product_name, colors.grey(res[i].product_sales), res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }

    console.log(table.toString());

    if (addInv) {
      addInventory();
    }

  });
  connection.end();
}


function viewLowInventory() {
  var query = 'SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?';
  connection.query(query, [0, 4], function(err, res) {

    // cli-table2 npm package
    var table = new Table({
        head: [colors.green('item_id'), colors.green('product_name'), colors.grey('product_sales'), colors.green('department_name'), colors.green('price'), colors.red('stock_quantity')], 
        colWidths: [10, 30, 16, 20, 10, 18],
        chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' }
    });

    for (var i = 0; i < res.length; i++) {
      table.push(
          [res[i].item_id, res[i].product_name, colors.grey(res[i].product_sales), res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }

    console.log(table.toString());

  });
  connection.end();
}


function addInventory() {
  inquirer
    .prompt([
      {
        name: 'inventoryId',
        type: 'input',
        message: 'What is the "Item ID" of the product for which you would like to add inventory?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please, enter an "Item ID" from the left column.';
        }
      },
      {
        name: 'inventoryQuantity',
        type: 'input',
        message: 'How many items would you like to add to inventory?',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
        console.log(answer.inventoryId + ' | ' + answer.inventoryQuantity);

      getStockQuantity(answer.inventoryId);

    });
}
function getStockQuantity(inventoryId) {
  var query = 'SELECT stock_quantity FROM products WHERE item_id = ?';
  connection.query(query, answer.inventoryId, function(err, res) {
      console.log('answer.inventoryId: ' + answer.inventoryId);
      console.log('res[0].stock_quantity: ' + res[0].stock_quantity);
      console.log('answer.inventoryQuantity: ' + answer.inventoryQuantity);
    newQuantity = parseInt(res[0].stock_quantity + answer.inventoryQuantity);
      console.log('newQuantity: ' + newQuantity);
  });
  updateStockQuantity(inventoryId, newQuantity);
} 

function updateStockQuantity(inventoryId, newQuantity) {
  var query = 'UPDATE products SET ? WHERE ?';
  connection.query(query,
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: inventoryId
      }
    ], function(err2, res) {

      console.log(res)

    // cli-table2 npm package
    var table = new Table({
        head: [colors.green('item_id'), colors.green('product_name'), colors.grey('product_sales'), colors.green('department_name'), colors.green('price'), colors.red('stock_quantity')], 
        colWidths: [10, 30, 16, 20, 10, 18],
        chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' }
    });

    for (var i = 0; i < res.length; i++) {
      table.push(
          [res[i].item_id, res[i].product_name, colors.grey(res[i].product_sales), res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }

    console.log(table.toString());

  });
  connection.end();
}


function addProduct() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addProduct',
        message: 'Product Name'
      },
      {
        type: 'input',
        name: 'addDepartment',
        message: 'Department Name'
      },
      {
        type: 'input',
        name: 'addPrice',
        message: 'Price'
      },
      {
        type: 'input',
        name: 'addQuantity',
        message: 'Stock Quantity'
      }
    ])
    .then(function(answer) {

      var query = 'INSERT INTO products SET ?';
      connection.query(query,
        {
          product_name: answer.addProduct,
          product_sales: 0,
          department_name: answer.addDepartment,
          price: answer.addPrice,
          stock_quantity: answer.addQuantity
        }, function(err, res) {

          var query2 = 'SELECT * FROM products';
          connection.query(query2, function(err2, res2) {

            // cli-table2 npm package
            var table = new Table({
                head: [colors.green('item_id'), colors.green('product_name'), colors.grey('product_sales'), colors.green('department_name'), colors.green('price'), colors.green('stock_quantity')], 
                colWidths: [10, 30, 16, 20, 10, 18],
                chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' }
            });

            for (var i = 0; i < res2.length; i++) {
              table.push(
                  [res2[i].item_id, res2[i].product_name, colors.grey(res2[i].product_sales), res2[i].department_name, res2[i].price, res2[i].stock_quantity]
              );
            }

            console.log(table.toString());

          });
          connection.end();

      });
    });
}








