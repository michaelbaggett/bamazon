var mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");

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

  //ANY TIME CONNECTION END IS RUN THE FOLLOWING ERROR IS RECEIVED:
  // Error: Cannot enqueue Query after invoking quit.

  //connection.end();
});


//this displays all our items
function openStore() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    for (i = 0; i < res.length; i++) {
      console.log(
        `
Product ID: ${chalk.yellow(res[i].item_id)} | Name: ${chalk.yellow(res[i].product_name)} | Price: ${chalk.yellow(res[i].price)} | In Stock: ${chalk.yellow(res[i].stock_quantity)}
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

  ]).then(function (response) {
    console.log(response.userChoice, response.userAmt);

    // match user chosen item w/ item ID from table
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      
          var purchasedProduct;
          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === parseInt(response.userChoice)) {
              purchasedProduct = res[i];
              console.log(purchasedProduct)
            }
          }
          if (purchasedProduct.stock_quantity >= parseInt(response.userAmt)) {
            connection.query(
              //in this statement set ? WHERE ? means
                  // first ? we are choosing the stock quantity to updated based upon the amount of
                  // items the user is purchasing
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: (purchasedProduct.stock_quantity - parseInt(response.userAmt))
                },

                // this is the 2nd ?; we are updating the stock quantity of the Specific item_ID
                // which is the purchased product item ID from above
                {
                  item_id: purchasedProduct.item_id
                }
              ],
            )
          } else {
            console.log("There are not enough items in stock for a purchase that large. Please reconsider the amount of items you would like to buy.")
          };
          openStore();
          //console.log(purchasedProduct.stock_quantity)
        });
  });
};