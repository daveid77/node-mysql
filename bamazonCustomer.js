var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('cli-table');
var colors = require('colors');

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
  connection.end();
  // runSearch();
});