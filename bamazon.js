var mysql = require("mysql");
const inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",

  // port
  port: 8889,

  // username
  user: "root",

  // password
  password: "root",
  database: "bamazon"
});
//connect to database & print out product table
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
    connection.query("SELECT * FROM products", function(err, res){
      if (err) throw err;
      
      for (i = 0; i < res.length; i++) {
        console.log(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity)
      }
      //console.log(res);
      connection.end();
    }) 

    });
