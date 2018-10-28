module.exports = function Cart(prevCart) { // can't be arrow function
  // initial shpping cart items
  this.movies = prevCart.movies || {};
  this.totalQty = prevCart.totalQty || 0;
  this.totalPrice = prevCart.totalPrice || 0;

  // adding new item
  this.add = function(movie, id) {
    let storedMovie = this.movies[id];
    if (!storedMovie) {
      storedMovie = this.movies[id] = { movie: movie, qty: 0, price: 0 };
    }
    storedMovie.qty++;
    storedMovie.price = storedMovie.movie.price * storedMovie.qty;
    this.totalQty++;
    this.totalPrice += storedMovie.movie.price;
  }

  // turn object to array our movie data (from mongp) is an array
  this.generateArray = function() {
    let arr = [];
    for (let id in this.movies) {
      arr.push(this.movies[id]);
    }
    return arr;
  }
}