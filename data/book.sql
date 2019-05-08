DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  author VARCHAR(100),
  isbn VARCHAR(100),
  description TEXT,
  image TEXT,
  bookshelf TEXT
);

INSERT INTO books (title, author, isbn, description, image, bookshelf) 
VALUES('Harry Potter', 'Adam', '1091240124', 'A really cool book', 'https://i.imgur.com/J5LVHEL.jpg', 'fantasy');
INSERT INTO books (title, author, isbn, description, image, bookshelf) 
VALUES('Some book', 'Jon', '13098104', 'A really good book', 'https://i.imgur.com/J5LVHEL.jpg', 'fantasy');