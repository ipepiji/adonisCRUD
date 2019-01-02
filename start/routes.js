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
// link, folder path or function
Route.on('/').render('homepage')

Route.get('/hiok', 'UserController.goWelcome')

Route.get('/viewAll', 'UserController.viewDB')

Route.get('/viewByID/:id', 'UserController.viewDBbyID')

Route.on('/add').render('db/add')

Route.post('/register', 'UserController.addDB')
