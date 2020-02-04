'use strict'

const Database = use('Database')
const Logger = use('Logger')

const axios = require('axios');

const Youtube = use('App/Models/Youtube');

class ApiController {

    async createToken({ request, response, auth }) {

        const data = request.input('data')
        const user = await Database.from('users').where('username', data.username)
        if (user != "") {
            const jwt_token = "await auth.generate(user)"
            return response.status(200).json({
                jwt_token: jwt_token
            })
        }
        else
            return response.status(401).json({
                status: "error",
                message: "user not exist"
            })

    }

    async getUser({ request, response, auth }) {
        try {
            await auth.check()
        } catch (error) {
            response.send('Missing or invalid jwt token')
        }

        const { username } = request.all();

        Logger
            .transport('file')
            .info(username, {
                'url': request.url()
            })

        return response.status(200).json({
            username: username
        })

    }

    async insert({ response }) {

        const part1 = "snippet",
            part2 = "statistics",
            maxResults1 = 50,      //50
            maxResults2 = 100,      //100
            order1 = "date",
            order2 = "time",
            publishedAfter = "2019-11-01T00:00:00Z",
            publishedBefore = "2019-12-01T23:59:00Z",
            q = "michael bloomberg|Michael Bloomberg|Bloomberg|bloomberg",
            key = "AIzaSyDacxZjGboO9K33kaDNYNoiKnKYtr-JWR4",
            candidate = "Michael Bloomberg",
            platform = "Youtube";

        let index1 = 0;

        const result1 = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=${part1}&maxResults=${maxResults1}&order=${order1}&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}&q=${q}&key=${key}`)

        const data = result1.data.items;

        for (var index2 in result1.data.items) {

            const result2 = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=${part2}&id=${data[index2].id.videoId}&key=${key}`)

            const stat = result2.data.items[0].statistics;

            const result3 = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads?part=${part1}&maxResults=${maxResults2}&order=${order2}&videoId=${data[index2].id.videoId}&key=${key}`)

            const comment = result3.data.items;

            for (var index3 in result3.data.items) {

                // console.log(
                //     {
                //         "index" : ++index1,
                //         // "id" : data[index2].id.videoId,
                //         "candidate" : candidate,
                //         "socmed_platform" : socmed_platform,
                //         "candidate_post" : data[index2].snippet.title,
                //         "citizen_comment": comment[index3].snippet.topLevelComment.snippet.textDisplay,
                //         "post_share" : stat.viewCount,
                //         "post_like" : stat.likeCount,
                //         "post_dislike" : stat.dislikeCount
                //     }
                // )

                await Youtube.create({
                    "platform": platform,
                    "candidate": candidate,
                    "post": data[index2].snippet.title,
                    "citizen_comment": comment[index3].snippet.topLevelComment.snippet.textDisplay,
                    "like": stat.likeCount,
                    "dislike": stat.dislikeCount,
                    "share": stat.viewCount,
                    "post_date": data[index2].snippet.publishedAt
                })

            }
        }

        response.status(200).json({
            status: "success",
            "message": "successfully insert into database"
        })
    }

    async update({ response }) {

        const part1 = "snippet",
            part2 = "statistics",
            maxResults1 = 2,
            maxResults2 = 2,
            order1 = "date",
            order2 = "time",
            publishedAfter = "2019-11-01T00:00:00Z",
            publishedBefore = "2019-11-13T23:59:00Z",
            q = "donald trump|Donald Trump|trump",
            key = "AIzaSyDacxZjGboO9K33kaDNYNoiKnKYtr-JWR4",
            candidate = "Donald Trump",
            platform = "Youtube";

        let index1 = 0;

        const result1 = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=${part1}&maxResults=${maxResults1}&order=${order1}&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}&q=${q}&key=${key}`)

        const data = result1.data.items;

        const db = await Youtube.all()

        var exist = false;

        for (var index in result1.data.items) {
            if (db.includes(data[index].id.videoId) == true) {

            }
        }

        for (var index2 in result1.data.items) {

            const result2 = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=${part2}&id=${data[index2].id.videoId}&key=${key}`)

            const stat = result2.data.items[0].statistics;

            const result3 = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads?part=${part1}&maxResults=${maxResults2}&order=${order2}&videoId=${data[index2].id.videoId}&key=${key}`)

            const comment = result3.data.items;

            for (var index3 in result3.data.items) {

                // console.log(
                //     {
                //         "index" : ++index1,
                //         // "id" : data[index2].id.videoId,
                //         "candidate" : candidate,
                //         "platform" : platform,
                //         "candidate_post" : data[index2].snippet.title,
                //         "citizen_comment": comment[index3].snippet.topLevelComment.snippet.textDisplay,
                //         "post_share" : stat.viewCount,
                //         "post_like" : stat.likeCount,
                //         "post_dislike" : stat.dislikeCount
                //     }
                // )

                await Youtube.create({
                    "platform": platform,
                    "candidate": candidate,
                    "post": data[index2].snippet.title,
                    "citizen_comment": comment[index3].snippet.topLevelComment.snippet.textDisplay,
                    "like": stat.likeCount,
                    "dislike": stat.dislikeCount,
                    "share": stat.viewCount,
                })

            }
        }

        response.status(200).json({
            status: "success",
            "message": "successfully insert into database"
        })
    }

}

module.exports = ApiController
