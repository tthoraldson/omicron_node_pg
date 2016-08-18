var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {
  // Retrieve books from database
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function (err, result) {
      done(); // closes connection, I only have 10!

      if (err) {
        res.sendStatus(500);
      }
      else {
        res.send(result.rows);
      }
    });
  });
});

// select unique book genres
router.get('/genres', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT DISTINCT genre FROM books', function (err, result) {
      done(); // closes connection, I only have 10!

      if (err) {
        res.sendStatus(500);
      }
      else {
        res.send(result.rows);
      }
    });
  });
});

// select books with x genre
router.get('/:withGenre', function (req, res) {
  // Retrieve books from database
  var selection = req.params.withGenre;
  console.log(selection);


  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books WHERE genre = $1', [selection], function (err, result) {
      done(); // closes connection, I only have 10!

      if (err) {
        res.sendStatus(500);
      }
      else {
        res.send(result.rows);
      }
    });
  });
});

router.post('/', function (req, res) {
  var book = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    else {
    client.query('INSERT INTO books (author, title, published, edition, publisher, genre) '
                + 'VALUES ($1, $2, $3, $4, $5, $6)',
                [book.author, book.title, book.published, book.edition, book.publisher, book.genre],
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  }
                  else {
                    res.sendStatus(201);
                  }
                });
    }
  });
});

router.put('/:id', function (req, res){
  var id = req.params.id;
  var book = req.body;

  pg.connect(connectionString, function (err, client, done){
    if (err){
      res.sendStatus(500);
    }
    else {
      client.query('UPDATE books ' +
                    'SET author = $1, ' +
                    'title = $2, ' +
                    'published = $3, ' +
                    'edition = $4, ' +
                    'publisher = $5, ' +
                    'genre = $6 ' +
                    'WHERE id = $7 ',
                    [book.author, book.title, book.published, book.edition, book.publisher, book.genre, id],
                    function (err, result){
                      done();
                      if (err){
                        res.sendStatus(500);
                      }
                      else {
                        res.sendStatus(200);
                      }
                    });
    }
  });
});

router.delete('/:id', function (req, res){
  var id = req.params.id;

  pg.connect(connectionString, function(err, client, done){
    if (err){
      res.sendStatus(500);
    }

      client.query('DELETE FROM books ' +
                    'WHERE id = $1',
                    [id],
                    function(err, result){
                      done();
                      if(err){
                        res.sendStatus(500);
                        return;
                      }
                      res.sendStatus(200);
                    });

  })
});

module.exports = router;
