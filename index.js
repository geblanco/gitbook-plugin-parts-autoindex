'use strict'

const cheerio = require('cheerio')
const PLUGIN_NAME = 'parts-autoindex'
const cfg = {}

function fixLevel(level){
	let lev = level.split('.')
	for(let i = 0; i < cfg.trim && undefined !== lev.shift(); i++);
	return lev.join('.')
}

function expandArticles(article){
	let articles = [{ title: article.title, level: article.level }]
	article.articles.forEach(art => {
		articles = articles.concat(expandArticles(art))
	})
	return articles
}

function findElement($, article, level){
	let found = false
	let ret = null
	for(let i = 0; i < level && !found; i++){
		ret = $('h' + (i +1)).filter(function(idx, el){
			return $(this).text().trim().toLowerCase() === article.title.trim().toLowerCase()
		})
		found = ret.text() !== ''
	}
	return found ? ret : null
}

function processor(pageContent, article, level){
	const articles = expandArticles(article)
	const $ = cheerio.load(pageContent)
	articles.forEach(art => {
		const artLevel = fixLevel(art.level)
		// Find the element tag
		const token = findElement($, art, level)
		if( token ){
			token.prepend(`<${token.name}>${artLevel} </${token.name}>`)
			pageContent = $.html()
		}
	})
	return pageContent
}

module.exports = {
	hooks: {
		init: function(){
			cfg.level = this.config.get('pluginsConfig')[PLUGIN_NAME]['level'] || 3
			cfg.trim = this.config.get('pluginsConfig')[PLUGIN_NAME]['trim'] || 0
		},
		page: function(page){
			let article = this.summary.getArticleByPath(page.path)
			page.content = processor(page.content, article, cfg.level)
			return page
		}
	}
}