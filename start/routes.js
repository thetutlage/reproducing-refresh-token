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
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('protected', async function () {
  return 'Protected route'
}).middleware('auth')

Route.post('auth', async function ({ request, auth }) {
  return auth.withRefreshToken().attempt(request.input('email'), request.input('password'))
})

Route.post('refresh', async function ({ request, auth }) {
  return auth.newRefreshToken().generateForRefreshToken(request.input('refresh_token'))
})
