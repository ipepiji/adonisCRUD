// events.js

const Event = use('Event')
const Pusher = require('pusher')
const Env = use('Env')

const pusher = new Pusher({
        appId: Env.get('PUSHER_APP_ID'),
        key: Env.get('PUSHER_KEY'),
        secret: Env.get('PUSHER_SECRET'),
        cluster: Env.get('PUSHER_CLUSTER'),
        encrypted: true
});

Event.on('send::message', async (message) => {
        pusher.trigger('obc-channel', 'send-message', {
                message
        });
})

Event.on('send::notification', async (message) => {
        pusher.trigger('btc-channel', 'new-notification', {
                message
        });
})