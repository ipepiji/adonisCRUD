'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class YoutubeSchema extends Schema {
  up () {
    this.create('youtubes', (table) => {
      table.increments()
      table.string('candidate')
      table.string('socmed_platform')
      table.string('candidate_post')
      table.string('citizen_comment')
      table.string('post_like')
      table.string('post_dislike')
      table.string('post_share')
      table.timestamps()
    })
  }

  down () {
    this.drop('youtubes')
  }
}

module.exports = YoutubeSchema
