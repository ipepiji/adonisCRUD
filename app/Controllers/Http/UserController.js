'use strict'

const Student = use('App/Models/Student')

const { validate } = use('Validator')

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

        await student.save()

        session.flash({ notification : {
            type    : 'success',
            message : 'Added !'
        }})

        return response.redirect('add') //link path
    }
}

module.exports = UserController
