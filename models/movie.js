var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: false }
});

module.exports = mongoose.model('Movie', movieSchema);