'use strict'

const Student = use('App/Models/Student');

const { validate } = use('Validator');

var transporter = use('App/ownModules/email-config');

var fileRead = use('App/ownModules/read-file-html');

var handlebars = require('handlebars');

var jwt = require('jsonwebtoken');

var btc = use('App/ownModules/btc-rpc-call');

var inLineCss = require('nodemailer-juice');

class UserController {
    async goWelcome ({ view}) {
        
        const data = await btc.rpc_call('ipepiji','listtransactions',['rhb'])
        console.log(data)

        if(data.error)
            console.log("ERROR !")
        else{
            return view.render('welcome', { 
                result : data.result
            }) //folder path
        }
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
        } catch(err) {  //expired token
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
            return response.redirect('back') //link path
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

        fileRead.readHTMLFile('./resources/views/welcome.edge', function(err, fileHTML) {    //path, callbackfunction
            const Env = use('Env')
            const APP_URL = Env.get('APP_URL')  //get host and port  : https://127.0.0.1:3333 or localhost:3333

            var token = jwt.sign({
                data: student.id    //payload = data untuk disimpan
              }, 'secret', { expiresIn: 60 });
            var template = handlebars.compile(fileHTML);    //parse file
            var parametersToSend = {    //pass variables
                 username: student.username,
                 link: APP_URL+"/viewByToken/"+token
            };
            var htmlToSend = template(parametersToSend);    //combine

            var mailOptions = { //setting email
                from: 'adonismailtest@gmail.com',
                to: student.email,
                subject: 'Sending Email using Node.js',
                html: htmlToSend  //text:
            };

            transporter.use('compile', inLineCss());

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
        fileRead.readHTMLFile('./resources/views/welcome.edge', function(err, fileHTML) {    //path, callbackfunction
            var token = jwt.sign({
                data: 1
              }, 'secret', { expiresIn: 60 * 60 });
              console.log(token)
            var template = handlebars.compile(fileHTML);    //parse file
            var parametersToSend = {    //pass variables
                 username: "Bruh",
                 link: "http://localhost:3333/viewByToken/"+token
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

    async login({ request, response, session, auth }){
        const validation = await validate(request.all(), {
            username: 'required|min:6|max:15',
            password: 'required|min:8'
        })

        if(validation.fails()){
            // session.withErrors([{ type: 'danger', message: 'error' }]).flashAll()
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back') //link path
        }

        const input_username = request.input('username')
        const input_password = request.input('password')

        const student = await Student.query()
                        .where('username', input_username)
                        .where('password', input_password)
                        .first()

        if(student){
            await auth.login(student)
            return response.route('mukadepan')    //same return response.redirect('/hiokhiok')
        }
        else{
            session.flash({ notification : {
                type    : 'danger',
                message : 'Wrong credential !'
            }})

            return response.redirect('back')
        }
    }

    async logout({ response,session,auth }){
        await auth.logout();
        session.flash({ notification : {
            type    : 'success',
            message : 'You successfully logout!'
        }})

        return response.route('login')
    }
}

module.exports = UserController
