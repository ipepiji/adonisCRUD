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

Route.on('/add').render('db/add')

Route.post('/register', 'UserController.addDB')

Route.get('/edit/:id', 'UserController.editDB')

Route.put('/update/:id', 'UserController.updateDB')

Route.delete('/delete/:id', 'UserController.deleteDB')

Route.get('/token', 'UserController.pageWithToken')

Route.on('/login').render('db/login')

Route.post('/login', 'UserController.login').as('login')    //.as('login') - action="{{route('login')}}"

Route.on('hiokhiok').render('db/homepage').as('mukadepan')

Route.get('/logout', 'UserController.logout')