DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  product_sales DECIMAL(10,2) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products
    (product_name, product_sales, department_name, price, stock_quantity)
VALUES
    ("Monopoly", 0, "Games", 14.89, 7),
    ("Scrabble", 0, "Games", 9.99, 6),
    ("Futon", 0, "Furniture", 277.50, 2),
    ("Coffee Table", 0, "Children", 144.99, 10),
    ("Toothpaste", 0, "Personal Hygeine", 4.19, 48),
    ("Comb", 0, "Personal Hygeine", 1.49, 78),
    ("Flat Ccreen TV", 0, "Electronics", 349.99, 7),
    ("Bluetooth Speaker", 0, "Electronics", 44.95, 35),
    ("Handheld Whiteboard", 0, "Office Supplies", 7.39, 62),
    ("Wire Mesh Desk Organizer", 0, "Office Supplies", 18.50, 4);

SELECT * FROM products;

-- UPDATE products SET stock_quantity = 0 WHERE item_id = 3;
-- SELECT * FROM products;

