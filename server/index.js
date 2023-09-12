// express.js
const express = require("express"); // import express
const app = express();
const cors = require("cors"); // import cors to authorize external requests
const userRoutes = require('./routes/user.routes')
const { checkUser } = require('./middleware/auth.middleware');
const { requireAuth } = require('./middleware/auth.middleware');

//cookie-parser
const cookieParser = require('cookie-parser');

// json parsing
const bodyParser = require("body-parser"); // JSON parser to use body in POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["sessionId", "Content-Type"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

//JWT
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

// dotenv
require("dotenv").config({ path: "./config/.env" }); // .env file in config directory

// db connect
require("./config/database").connectToMongoDB(); // async function to connect to database

// routes
const postRoutes = require("./routes/post.routes.js"); // api urls
app.use('/api/post', postRoutes); // root url
app.use('/api/user', userRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`); // run server
});
