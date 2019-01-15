'use strict'

const Student = use('App/Models/Student');

const { validate } = use('Validator');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');    //Need to send email for security reason

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: 'adonismailtest@gmail.com',
      pass: 'adonis12345'
    }
}));

var handlebars = require('handlebars');
var fs = require('fs');

var readHTMLFile = function(path, callback) {   
    fs.readFile(path, {encoding: 'utf-8'}, function (err, fileHTML) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, fileHTML);
        }
    });
};

const btc_rpc = require('node-bitcoin-rpc');

var jwt = require('jsonwebtoken');

class UserController {
    async goWelcome ({view}) {
        
        btc_rpc.call('ipepiji','getbalance',['rhb'],function(err,result){
            if(err)
                console.log("error")

            console.log(result.result)
        })
        return view.render('welcome') //folder path
    }

    async viewDB ({view}) {
        const student = await Student.all()
        
        return view.render('db/list', {
            data : student.toJSON() //More than one need to be bundled in JSON
        })
    }

    async viewDBbyID ({params, view}) {
        // check valid or invalid token - synchronous function
        try {
            var decoded = jwt.verify(params.token, 'secret');

            const student = await Student.findBy('id', decoded.data)
                return view.render('db/listbyid', {
                    data : student  //No need in JSON but also can in JSON
                })
        } catch(err) {
            console.log(err.message)
        }
    }

    async addDB ({request, response, session}) {
        const validation = await validate(request.all(), {
            username: 'required|min:6|max:15',
            password: 'required|min:8'
        })

        if(validation.fails()){
            // session.withErrors([{ type: 'danger', message: 'error' }]).flashAll()
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('add') //link path
        }

        const student = new Student()

        student.username = request.input('username')
        student.password = request.input('password')
        student.email = request.input('email')

        await student.save()

        session.flash({ notification : {
            type    : 'success',
            message : 'Added !'
        }})

        readHTMLFile('./resources/views/welcome.edge', function(err, fileHTML) {    //path, callbackfunction
            var token = jwt.sign({
                data: student.id
              }, 'secret', { expiresIn: 60 });
            var template = handlebars.compile(fileHTML);    //parse file
            var parametersToSend = {    //pass variables
                 username: student.username,
                 link: "http://localhost:3333/viewByToken/"+token
            };
            var htmlToSend = template(parametersToSend);    //combine

            var mailOptions = { //setting email
                from: 'adonismailtest@gmail.com',
                to: student.email,
                subject: 'Sending Email using Node.js',
                html: htmlToSend  //text:
            };

            transporter.sendMail(mailOptions, function(error, info){    //function email
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }          
            });
            
        });

        return response.redirect('add') //link path
    }

    async editDB ({params, view}) {
        const student = await Student.findBy('id', params.id) //column, params link // Student.find(params.id) also can

        return view.render('db/update', {
            data : student
        })
    }

    async updateDB ({response, request, params, session}) {
        const validation = await validate(request.all(), {
            username: 'required|min:6|max:15',
            password: 'required|min:8'
        })

        if(validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const student = await Student.findBy('id', params.id)

        student.username = request.input('username')
        student.password = request.input('password')
        student.email = request.input('email')

        await student.save()

        session.flash({ notification: {
            type : 'success',
            message : "Updated !"
        } })

        return response.redirect('/viewAll')
    }

    async deleteDB({response, request, session, params}) {

        const student = await Student.findBy('id', params.id)

        await student.delete()

        session.flash({ notification: {
            type : 'danger',
            message : "Deleted !"
        } })

        return response.redirect('/viewAll')
    }

    async pageWithToken({ response }){
        readHTMLFile('./resources/views/welcome.edge', function(err, fileHTML) {    //path, callbackfunction
            var token = jwt.sign({
                data: 'hiok3'
              }, 'secret', { expiresIn: 60 * 60 });
              console.log(token)
            var template = handlebars.compile(fileHTML);    //parse file
            var parametersToSend = {    //pass variables
                 username: "Bruh",
                 link: "http://localhost:3333/viewByID/"+token
            };
            var htmlToSend = template(parametersToSend);    //combine

            var mailOptions = { //setting email
                from: 'adonismailtest@gmail.com',
                to: 'adonismailtest@gmail.com',
                subject: 'Testing',
                html: htmlToSend  //text:
            };

            transporter.sendMail(mailOptions, function(error, info){    //function email
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }          
            });

            // check valid or invalid token - asynchronous function
            jwt.verify(token, 'secret', function(err, decoded) {
                if (err) {
                  /*
                    err = {
                      name: 'TokenExpiredError',
                      message: 'jwt expired',
                      expiredAt: 1408621000
                    }
                  */
                 console.log(err.message)
                }
                
                console.log(decoded)
              });
            
        });

        return response.redirect('/') //link path
    }
}

module.exports = UserController
