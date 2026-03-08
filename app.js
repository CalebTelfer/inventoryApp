require("dotenv").config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

//ejs config
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//route
const indexRouter = require('./routes/indexRouter');
app.use('/', indexRouter);



//start server
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}`);
})