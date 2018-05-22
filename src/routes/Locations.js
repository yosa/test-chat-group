const Locations = require('../models/Locations')

module.exports = function(server, io) {

  /**
   * Create
   */
  server.post('/locations', (req, res, next) => {
    let data = req.body || {}
    Locations.create(data)
      .then(record => {
        res.status(200).send({
          success: true,
          data: record
        })
        io.sockets.emit('locations', data)
        next()
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          errors: err
        })
      })

  })

  /**
   * get all locations
   */
  server.get('/locations', (req, res, next) => {
    Locations.find({})
      .then(records => {
        res.status(200).send({
          success: true,
          data: records
        })
        next()
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          errors: err
        })
      })
  })

  /**
   * Delete all locations
   */
  server.delete('/locations', (req, res, next) => {
    Locations.remove({})
      .then(() => {
        res.status(200).send({
          success: true
        })
        next()
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          errors: err
        })
      })
  })

}
