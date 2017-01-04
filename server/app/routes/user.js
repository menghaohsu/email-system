'use strict';

const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const path = require('path');
const sequelize = require('sequelize');
const request = require('request');
const PDFDocument = require('pdfkit');
const btoa = require('btoa')
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const fs = require('fs');

const _jade = require('jade');
const User = models.User;
const Dessert = models.Dessert;

module.exports = router;



router.post('/addUser', (req, res, next) => {
	User.create(req.body)
	.then(user => res.redirect('../../../index.html'))
	.catch(next);
});


router.post('/sentEmail', (req, res, next) => {
	User.findAll()
	.then(users => {
		let promistArrOut = [];
		users.forEach(user =>{
			const code = { couponCode: [], confirmationCode: []};
			const promise = Dessert.findAll({
				where: {
					month: Number(req.body.month),
					year: Number(req.body.year)
				}
			})
			.then(desserts => {
				let promiseArr = [];
				desserts.forEach(dessert => {
					promiseArr.push(download(dessert.image, dessert.name+'.png', dessert))
				})
				return Promise.all(promiseArr)
			}).then(desserts => {

				let doc = new PDFDocument();	
				return savePdfToFile(doc, 'code.pdf', desserts, code)

			}).then(() => {
				for(let i=0; i<code.couponCode.length; i++){
					user.update({
						[`code${i+1}`]: code.couponCode[i],
						[`confirmationCode${i+1}`]: code.confirmationCode[i],
						sentDate: sequelize.fn('NOW')
					})
				}
			}).then(() => {
				let transporter = nodemailer.createTransport({
		            service: 'Gmail',
		            auth: {
		                user: 'kingpong123321@gmail.com', // Your email id
		                pass: 'kingpong123' // Your password
		            }
		        })
	            let mailOptions = {
		            from: '"Marcus App" <kingkong@kingpong.com>', // sender address
		            to: user.email, // list of receivers
		            subject: 'Comfirmation email', // Subject line
		            text: 'You have order ', // plaintext body
		            //html: newFile, // html body
		            attachments: [
		              {
		                path: "code.pdf"
		              }
		            ]
		        };
		        return new Promise((resolve, reject) => {
		        	transporter.sendMail(mailOptions, function(error, info){
			          if(error){
			              return console.log(error);
			          }else{
			              resolve('Message sent: ' + info.response);
			          }
			        });
		        })

		        
	        })
			promistArrOut.push(promise);	
		})	
		return Promise.all(promistArrOut)	
	}).then(() => {
		return Dessert.findAll({
			where: {
				month: Number(req.body.month),
				year: Number(req.body.year)
			}
		}).then(desserts => {
			let fileArr = [];
			desserts.forEach(dessert => {
				fileArr.push(`${dessert.name}.png`);
			})
			fileArr.push('code.pdf')
			fileArr.forEach(function(item,index,array){
		        fs.unlink(item, function(err){
		            if (err) throw err;
		        });
     		});
		})
	})
	.then(() => {
		res.redirect('../../../index.html')
	})
	
})

function codeGenerator() {
    return Math.random().toString(36).substr(2, 5)
}
function confrimationCodeGenerator() {
    return Math.random().toString(36).substr(2, 4)
}
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return 'data:image/png;base64,'+String.fromCharCode('0x' + p1);
    }));
}
function download(uri, filename, dessert){
    return new Promise((resolve,reject) =>{
	  	request.head(uri, (err, res, body) => {
	  		if(err){
	  			console.log(err)
	  		}
	    	request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
	    		resolve(dessert);
	    	});
	  	});
    })
};
function savePdfToFile(doc, fileName, desserts, code) {
    return new Promise((resolve, reject) => {

        // To determine when the PDF has finished being written successfully 
        // we need to confirm the following 2 conditions:
        //
        //   1. The write stream has been closed
        //   2. PDFDocument.end() was called syncronously without an error being thrown

        let pendingStepCount = 2;

        const stepFinished = () => {
            if (--pendingStepCount == 0) {
                resolve(desserts);
            }
        };
        const writeStream = fs.createWriteStream("code.pdf");
        writeStream.on('close', stepFinished);
        doc.pipe(writeStream);
		desserts.forEach(dessert => {
			let couponCode = codeGenerator();
			let confirmationCode = confrimationCodeGenerator();
			code.couponCode.push(couponCode);
			code.confirmationCode.push(confirmationCode);
			doc.image(`${dessert.name}.png`, {height:100,width:100});
				doc.text("Name: " + dessert.name);
				doc.text("Description: " + dessert.description);
				doc.text("Coupon code: " + couponCode);
				doc.text("Confimation code: " + confirmationCode);
				doc.moveDown();
		})

		doc.end();
        stepFinished();
    }); 
}

