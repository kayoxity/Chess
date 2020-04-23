var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/',(req,res) => {
  res.render('index');
});

app.listen('3000', () => console.log('Listening on port 3000'));