'use strict'

const Database = use('Database')

class ApiController {

    async createToken ({ request, response, auth }) {

        const data = request.input('data')
        const user = await Database.from('users').where('username', data.username)
        if(user != ""){
            const jwt_token = "await auth.generate(user)"
            return response.status(200).json({
                jwt_token : jwt_token
            })
        }
        else
            return response.status(401).json({
                status  : "error",
                message : "user not exist"
            })

    }

    async getUser ({ request, response, auth }) {
        try {
            await auth.check()
        } catch (error) {
            response.send('Missing or invalid jwt token')
        }

        const { username } = request.all();
        return response.status(200).json({
            username : username+" bin bapak kau"
        })

    }

}

module.exports = ApiController
