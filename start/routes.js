'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
// link and folder path or function
// ada '/' kt depan start link from base, kalau x de die sambung dgn previous link
Route.on('/').render('homepage')

Route.get('/welcome', 'UserController.goWelcome')

Route.get('/viewAll', 'UserController.viewDB')

Route.get('/viewByID/:id/:token', 'UserController.viewDBbyID')

Route.get('/viewByToken/:token', 'UserController.viewDBbyID')

// Route.on('system/add').render('db/add').middleware(['authenticated']) //middleware selagi tak logout, xleh g page add and will auto redirect to mukadepan/hiokhiok page

Route.post('/register', 'UserController.addDB')

Route.get('/edit/:id', 'UserController.editDB')

Route.put('/update/:id', 'UserController.updateDB')

Route.delete('/delete/:id', 'UserController.deleteDB')

Route.get('/token', 'UserController.pageWithToken')

// Route.on('system/login').render('db/login').middleware(['authenticated'])     //middleware selagi tak logout, xleh g page login and will auto redirect to mukadepan/hiokhiok page

Route.post('/login', 'UserController.login').as('login')    //.as('login') - action="{{route('login')}}"

Route.on('/hiokhiok').render('db/homepage').as('mukadepan').middleware(['auth'])

Route.get('/logout', 'UserController.logout')

Route.group(() => { 
    Route.on('/add').render('db/add')
    Route.on('/login').render('db/login')
})
.prefix('/system')
.middleware(['authenticated'])

Route.get('/qrcode', 'UserController.generateQRCode')

//pusher

//chat
Route.on('live-chat').render('pusher.chat').as('chat')

Route.post('/live-chat/send','UserController.sendMessage').as('sendMessage')

Route.on('view-chat').render('pusher.view')

//push-notification
Route.on('push-notification').render('pusher.send-push-notification').as('pushN')

Route.post('/push-notification/send','UserController.sendPushNotification').as('sendPushNotification')

Route.get('/testapi','UserController.getAPI')

//restapi
Route.post('/api/v1/token','ApiController.createToken')

Route.group(() => {
    Route.get('/user','ApiController.getUser')
})
.prefix('/api/v1')
// .middleware('throttle:1')
// .middleware(['auth:jwt'])

Route.get('/diffTableName', 'UserController.test')

//Unit/Functional test

Route.get('/posts', async ({ response }) => {
    
    const data = { 
                    title: "Adonis 101",
                    body: "Blog post content"
                 }

    const Database = use('Database')

    const posts = await Database
                .table('posts')
                .where(data)
                .first()

    if(posts)
        response.status(200).json([data])
    else
        response.status(400).json({
            status : 'error',
            message : 'bad request'
        })
    
  })

  //Youtube api
  Route.get('/youtubeInsert', 'ApiController.insert')
  Route.get('/youtubeUpdate', 'ApiController.update')