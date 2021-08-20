const { urlencoded } = require('express')
const express = require('express')
const expressLayouts  = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const logger=require('./logger').mainLogger;
const routes= require('./routes')
const cors = require('cors');
const app = express()

app.use(express.static(__dirname + '/public'));
app.use('/document',express.static(__dirname+'public/'))

/**For EJS and EJS layouts 
 * 
app.use(expressLayouts)
app.set('layout', './layouts/full-width.ejs')
app.set('view-engine','ejs')*/

// app.get('/',(req,res)=>{
//     const loggedUser={firstname:"Santanu",lastname:"Phukan"}
//     res.render('index.ejs',{user: loggedUser,title: "Home Page"})
// })


/**Configuring DB (Testing the DB Connetion)*/ 


// const db = require('./db')

// db.authenticate().then(()=>{
//     logger.info('DB Connection has been established successfully.');
// }).catch((err)=>{
//     logger.error(err.toString());
//     console.log(err.toString());
// })

app.use(urlencoded({extended:false}))
app.use(cors())
app.use(express.json())
app.get('/', (req,res)=>{
    res.send("/")
})
app.use(routes(this.app))

module.exports = app