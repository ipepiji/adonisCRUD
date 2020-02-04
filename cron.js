require('dotenv').config()

const cron = require('./function/task')

async function start() {

    const ACCESS_TOKEN = await cron.getAccessToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REFRESH_TOKEN);

    const RESULT = await cron.cronYoutubeVideoDB(ACCESS_TOKEN);

    return RESULT;
    
}

start()
    .then(function (result) {
        console.log(result);
    })