'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pelajar extends Model {
    static get table () {
        return 'students' //link ke db table mana, kalau xde ni..die cri table pelajars kt db as default
      }
}

module.exports = Pelajar
