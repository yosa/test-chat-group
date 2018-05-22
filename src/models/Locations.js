const mongoose   = require('mongoose'),
  timestamps = require('mongoose-timestamp')

const LocationsSchema = new mongoose.Schema({
  latitude: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  longitude: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  accuracy: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  speed: {
    type: mongoose.Schema.Types.Decimal128,
    required: false
  },
  color: {
    type: mongoose.Schema.Types.String,
    required: false
  },
  timestamp: {
    type: mongoose.Schema.Types.Number,
    required: true
  }
}, {
  collection: 'locations'
})

LocationsSchema.plugin(timestamps)

module.exports = exports = mongoose.model('Locations', LocationsSchema)
