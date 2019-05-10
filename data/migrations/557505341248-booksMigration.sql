CREATE TABLE BOOKSHELVES (id SERIAL PRIMARY KEY, name VARCHAR(255));
- Creates the Bookshelves table in the books database 

INSERT INTO bookshelves(name) SELECT DISTINCT bookshelf FROM books;
- Retrive unique bookshelf values from the books table and inserts them into the bookshelf table

ALTER TABLE books ADD COLUMN bookshelf_id INT;
- Add a column to the bookshelf table called bookshelf_id

UPDATE books SET bookshelf_id=shelf.id FROM (SELECT * FROM bookshelves) AS shelf WHERE books.bookshelf = shelf.name;
- Pairs a connection between the books and bookshelves table 

ALTER TABLE books DROP COLUMN bookshelf;
- Remove bookshelf column from books table 

ALTER TABLE books ADD CONSTRAINT fk_bookshelves FOREIGN KEY (bookshelf_id) REFERENCES bookshelves(id);
- Sets bookshelf_id in the bookshelf table as the foreign key that references the primary keys in the books table
