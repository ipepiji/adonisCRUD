'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Authenticated {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth, response }, next) {  // kena register kat namedMiddleware in kernel.js
    // call next to advance the request
    try {
      
      await auth.check()

      return response.route('mukadepan')

    } catch (error) {
      
    }

    await next()
  }
}

module.exports = Authenticated
