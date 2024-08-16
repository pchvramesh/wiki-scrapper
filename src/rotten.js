const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs')

const country = 'Australian'

let movies = []

function ScrapeMovieData(page) {
    console.log(page)
    const url = `https://www.rottentomatoes.com/napi/browse/movies_at_home/?after=${page}`;
    try {
        axios.get(url)
            .then(response => {
                const {data} = response
                const {pageInfo, grid} = data
                movies = movies.concat(grid.list.map(e => ({
                    title: e.title,
                    url: e.mediaUrl,
                    type: e.type,
                    release_date: e.releaseDateText
                })))
                fs.writeFileSync('movies.json', JSON.stringify(movies, null, 4))
                if(pageInfo.hasNextPage){
                    ScrapeMovieData(pageInfo.endCursor)
                }
            })
    }
    catch (e) {
        console.log(e.message)
    }
}

ScrapeMovieData('Mjc=')