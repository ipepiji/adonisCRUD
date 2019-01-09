'use strict'

const Student = use('App/Models/Student')

const { validate } = use('Validator')

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport')    //Need to send email for security reason

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
            throw err;
            callback(err);
        }
        else {
            callback(null, fileHTML);
        }
    });
};

class UserController {
    async goWelcome ({view}) {
        return view.render('welcome') //folder path
    }

    async viewDB ({view}) {
        const student = await Student.all()
        
        return view.render('db/list', {
            data : student.toJSON() //More than one need to be bundled in JSON
        })
    }

    async viewDBbyID ({params, view}) {
        const student = await Student.findBy('id', params.id) //column, params link // Student.find(params.id) also can

        return view.render('db/listbyid', {
            data : student  //No need in JSON but also can in JSON
        })
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
            var template = handlebars.compile(fileHTML);    //parse file
            var parametersToSend = {    //pass variables
                 username: student.username,
                 link: "http://localhost:3333/viewByID/"+student.id
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
}

module.exports = UserController
