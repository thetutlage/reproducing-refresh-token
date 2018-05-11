'use strict'

const { test, trait } = use('Test/Suite')('Jwt')
trait('Test/ApiClient')
trait('DatabaseTransactions')

test('login and get token', async ({ assert, client }) => {
  const response = await client
    .post('auth')
    .send({ email: 'virk@adonisjs.com', password: 'secret' })
    .end()

  response.assertStatus(200)
  assert.property(response.body, 'token')
  assert.property(response.body, 'refreshToken')
})

test('login and use token to access protected route', async ({ assert, client }) => {
  const auth = await client
    .post('auth')
    .send({ email: 'virk@adonisjs.com', password: 'secret' })
    .end()

  const response = await client
    .get('protected')
    .header('Authorization', `Bearer ${auth.body.token}`)
    .end()

  response.assertStatus(200)
})

test('generate new token from refresh token', async ({ assert, client }) => {
  const auth = await client
    .post('auth')
    .send({ email: 'virk@adonisjs.com', password: 'secret' })
    .end()

  const response = await client
    .post('refresh')
    .send({ refresh_token: auth.body.refreshToken })
    .end()

  response.assertStatus(200)
  assert.property(response.body, 'token')
  assert.property(response.body, 'refreshToken')
})

test('use new jwt token to access protected route', async ({ assert, client }) => {
  const auth = await client
    .post('auth')
    .send({ email: 'virk@adonisjs.com', password: 'secret' })
    .end()

  const refreshed = await client
    .post('refresh')
    .send({ refresh_token: auth.body.refreshToken })
    .end()

  const response = await client
    .get('protected')
    .header('Authorization', `Bearer ${auth.body.token}`)
    .end()

  response.assertStatus(200)
})
