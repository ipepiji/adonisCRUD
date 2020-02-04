'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Youtube extends Model {
    static get table () {
        return 'social_medias' //link ke db table mana, kalau xde ni..die cri table pelajars kt db as default //migration just used untuk buat table kt db....xde link pon dari controller
      }
}

module.exports = Youtube
