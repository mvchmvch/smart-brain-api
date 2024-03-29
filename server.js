const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors  = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const pg = knex({
  client: 'pg',
  connection: {
  	connectionString: process.env.DATABASE_URL,
 	ssl: true
  }
});

const app = express();
app.use( bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send("it is working")})
app.post('/register', (req, res) => {register.handleRegister(req, res, pg, bcrypt)})
app.post('/signin', (req, resp) =>  {signin.handleSignin(req, resp, pg, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, pg)})
app.put('/image', (req, res) => {image.handleImage(req, res, pg)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})




app.listen(process.env.PORT || 3000, () => {
	console.log (`app is running on port ${process.env.PORT}`);
})

