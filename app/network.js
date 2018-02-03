const express = require('express')
const app = express()

app.get('/', function (req, res) {
	res.send('Hello World!')
})
app.get('/transfer/text', function (req, res) {
	var text = req.param('text');
	res.send({status:'success'})
})
app.listen(3000, '0.0.0.0');