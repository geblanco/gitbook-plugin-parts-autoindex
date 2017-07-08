'use strict'

const cheerio = require('cheerio')
const escapeReg = require('escape-string-regexp')
const PLUGIN_NAME = 'parts-autoindex'
const cfg = {}

function fixLevel(level){
	let lev = level.split('.')
	for(let i = 0; i < cfg.trim && undefined !== lev.shift(); i++);
	return lev.join('.')
}

function processor(pageContent, article, level){
	const regex = new RegExp('(#{1,' + level + '}\\s?)(' + escapeReg(article.title) + ')')
	const artLevel = fixLevel(article.level)
	let content = pageContent.replace(regex, `$1${artLevel} ${article.title}`)
	article.articles.forEach(art => {
		content = processor(content, art, level)
	})
	return content
}

module.exports = {
	hooks: {
		init: function(){
			cfg.level = this.config.get('pluginsConfig')[PLUGIN_NAME]['level'] || 3
			cfg.trim = this.config.get('pluginsConfig')[PLUGIN_NAME]['trim'] || 0
		},
		'page:before': function(page){
			let article = this.summary.getArticleByPath(page.path)
			page.content = processor(page.content, article, cfg.level)
			return page
		}
	}
}