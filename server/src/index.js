const app = require('./app');
const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log("Server Listening to port 5000\nUri: http://localhost:"+PORT)
})