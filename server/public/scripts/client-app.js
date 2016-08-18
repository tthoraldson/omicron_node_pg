$(document).ready(function () {
  getBooks();
  getGenresFromBooks();

  // add a book
  $('#book-submit').on('click', postBook);

  // update book
  $('#book-list').on('click', '.update', putBook);

  // delete book
  $('#book-list').on('click', '.delete', deleteBook);

  // filter genre
  $('#selectGenre').on('click', '#filter', getGenre);

  // remove genre filter
  $('#selectGenre').on('click', '#removeFilter', getBooks);
});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function (books) {
      $('#book-list').empty();
      console.log('GET /books returns:', books);
      books.forEach(function (book) {
        var $el = $('<div></div>');

        var bookProperties = ['title', 'author', 'published', 'edition', 'publisher', 'genre'];
        bookProperties.forEach(function(property){
          var inputType = 'text';
          if (property == 'published'){
            // inputType = 'date';
            // book[property] = new Date(book[property]);
          }


          var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
          $input.val(book[property]);
          $el.append($input);
        });

        $el.data('bookId', book.id);
        $el.append('<button class="update">Update</button>');
        $el.append('<button class="delete">Delete</button>');

        $('#book-list').append($el);
      });
    },


    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    }
  });
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
  event.preventDefault();

  var book = {};

  $.each($('#book-form').serializeArray(), function (i, field) {
    book[field.name] = field.value;
  });

  console.log('book: ', book);

  $.ajax({
    type: 'POST',
    url: '/books',
    data: book,
    success: function () {
      console.log('POST /books works!');
      $('#book-list').empty();
      getBooks();
      getGenresFromBooks();
    },

    error: function (response) {
      console.log('POST /books does not work...');
    },
  });
}

function putBook(){
  var book = {};
  $.each($(this).parent().children().serializeArray(), function(i, field){
    book[field.name] = field.value;
  });

  console.log('book we are putting', book);

  var bookID = $(this).parent().data('bookId');

  $.ajax({
    type: 'PUT',
    url: '/books/' + bookID,
    data: book,
    success: function(){
      getBooks();
      getGenresFromBooks();
    },
    error: function(){
      console.log('ERROR PUT /books/' + bookID);
    }
  });
}

function deleteBook(){
  var bookID = $(this).parent().data('bookId');

  $.ajax({
    type: 'DELETE',
    url: '/books/' + bookID,
    success: function(){
      console.log('DELETE success');
      $('#book-list').empty();
      getBooks();
      getGenresFromBooks();
    },
    error: function(){
      console.log('DELETE failed');
    }
  });
}

function getGenresFromBooks(){
  $.ajax({
    type: 'GET',
    url: '/books/genres',
    success: function(genres){
      $('#filterGenres').empty();
      console.log('GET /genres returns:', genres);
      genres.forEach(function(genre, i){
        var option = genres[i].genre;
        var $selectOption = $('<option value="' + option + '">' + option + '</option>');
        $('#filterGenres').append($selectOption);
      });
    },
    error: function(){
      console.log('GET /books/genres failed');
    }
  });
}

function getGenre(){
  event.preventDefault();

  var selection = $('#filterGenres').val();
  console.log(selection);

  $.ajax({
    type: 'GET',
    url: '/books/' + selection,
    success: function (books) {
      $('#book-list').empty();
      console.log('GET /books/withGenre returns:', books);
      books.forEach(function (book) {
        var $el = $('<div></div>');

        var bookProperties = ['title', 'author', 'published', 'edition', 'publisher', 'genre'];
        bookProperties.forEach(function(property){
          var inputType = 'text';
          if (property == 'published'){
            // inputType = 'date';
            // book[property] = new Date(book[property]);
          }


          var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
          $input.val(book[property]);
          $el.append($input);
        });

        $el.data('bookId', book.id);
        $el.append('<button class="update">Update</button>');
        $el.append('<button class="delete">Delete</button>');

        $('#book-list').append($el);
      });
    },


    error: function (response) {
      console.log('GET /books/withGenre fail. No books could be retrieved!');
    }
  });

  };
