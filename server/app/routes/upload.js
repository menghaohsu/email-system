const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const path = require('path');

const Dessert = models.Dessert;
module.exports = router;

router.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../../../browser/uploadForm.html'));
})

router.get('/selectDate', (req, res, next) => {
	Dessert.findAll({ where: req.query})
	  .then((desserts) => {
		  res.render('show', {desserts: desserts})
	  }).catch(next);	
})

router.post('/uploadDessert', (req, res, next) => {
	Dessert.findAll(req.body)
	  .then((desserts) => {
		  Dessert.create(req.body)
		    .then((dessert) => res.redirect('../../../index.html'))
	  }).catch(next);	
});

router.post('/deleteDessert', (req, res, next) => {
	Dessert.findOne({
		where:{
			month: Number(req.body.month),
			year: Number(req.body.year),
			name: req.body.name
		}
	})
	  .then((dessert) => {
		  return dessert.destroy()
		  .then(() => {
			  res.sendStatus(201);
		  })
   	})
	.catch(next);
})



