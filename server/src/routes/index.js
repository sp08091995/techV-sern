module.exports = function(app) {
    const mainroute = require('express').Router()
    const logger = require('../logger').mainLogger;
  
    const r_document = require('./document'); /*document route*/
  
    mainroute.use('/document', r_document(app)); /*document route*/
  
    mainroute.get('/', (req, res) => {
      try {
        // res.redirect('/')
      } catch (error) {
        logger.info(error.toString())
      }
    });
  
    return mainroute;
  };