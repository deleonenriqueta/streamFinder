const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 3000;

const { getTitleIds, getTitleDetails, getRelated } = require('./apiMethods/search.js');
const { insertTitle, insertUser, retrieveAllStreams, retrieveOneStream, insertStream} = require('./database/dbMethods.js');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))

app.listen(port, () => {
  console.log('listening on port ', port);
});



///////////////////////
// Search
///////////////////////

// given an title string from the search component, this sends back all title detail objects
app.post('/search', (req, res) => {
  var searchTerm = req.body.query;
  getTitleIds(searchTerm)
  .then(ids => getTitleDetails(ids))
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log('error retrieving search results => ', err)
  });
});


// given an id, this sends back all related title detail objects
app.post('/related', (req, res) => {
  var id = req.body.query;
  getRelated(id)
  .then(data => res.send(data));
});



///////////////////////
// Login / Signup
///////////////////////

app.get('/login', (req, res) => {})

app.get('/signup', (req, res) => {
  var user = req.body.user;
  insertUser(user)
  .then(data => {
    console.log('user creation success')
    res.send(data);
  })
})





///////////////////////
// Watchlist
///////////////////////

app.get('/watchlist/:userID', (req, res) => {

})


///////////////////////
// Settings
///////////////////////

app.get('/streams', (req, res) => {
  retrieveAllStreams()
  .then(data => {
    res.status(200).json({success: true, data: data})
  })
  .catch(err => res.status(400).json({success: false, error: err}))
})

app.get('/streams/:stream', (req, res) => {
  retrieveOneStream(req.params.stream)
  .then(data => {
    res.status(200).json({success: true, data: data})
  })
  .catch(err => res.status(400).json({success:false, error: err}))
})

app.post('/streams', (req, res) => {
  insertStream(req.body)
  .then(() => res.status(201).json({success: true}))
  .catch(err => res.status(400).json({success: false, error: err}))

})

