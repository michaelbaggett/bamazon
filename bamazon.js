var mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk")

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
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  openStore();
  connection.end();
});



function openStore() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    for (i = 0; i < res.length; i++) {
      console.log(
        `
Product ID: ${res[i].item_id} | Name: ${res[i].product_name} | Price: ${res[i].price} | In Stock: ${res[i].stock_quantity}
`)
    }
    userPurchase();
  })
};

//user purchase an item function
function userPurchase() {
  inquirer.prompt([{
      type: "input",
      message: "Which Product Would you like to purchase?",
      name: "userChoice"
    },
    {
      type: "input",
      message: "How many would you like to buy?",
      name: "userAmt"
    },

  ]).then(function (inquirerResponse) {
    const data = inquirerResponse;
    console.log(data.userChoice, data.userAmt)
  });
}