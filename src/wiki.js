const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs')

function ScrapeMovieData(year, country) {
    const url = `https://en.wikipedia.org/wiki/List_of_${country}_films_of_${year}`;

    const file_name= `movies_${country}_${year}`

    try {
        axios.get(url)
            .then(async response => {
                const html = response.data;
                console.log(year, country)
                const $ = cheerio.load(html, { decodeEntities: false });
                let mList = $('table.wikitable tbody tr').map((index, e) => {
                    const obj = {
                        title: $(e).find('i a').text(),
                        url: $(e).find('i a').attr('href'),
                        element: e
                    }
                    return obj
                }).get().filter(e => !!e.url && !new RegExp('edit', 'ig').test(e.url) && !new RegExp('http','ig').test(e.url))

                let records = await Promise.all(mList.map((e) => {
                    const url = `https://en.wikipedia.org${e.url}`
                    return axios.get(url).then((resp) => {
                        const mHtml = cheerio.load(resp.data)
                        const movie = {}
                        movie.title = e.title
                        movie.year = year
                        mHtml('table.infobox.vevent tr').each((index, element) => {
                            const header = $(element).find('th').text().trim();
                            const value = $(element).find('td').text().trim();
                            if (header && value) {
                                switch (header) {
                                    case 'Directed by':
                                        movie.director = value;
                                        break;
                                    case 'Written by':
                                        movie.writer = value;
                                        break;
                                    case 'Produced by':
                                        movie.producer = value;
                                        break;
                                    case 'Screenplay by':
                                        movie.screenplay = value;
                                        break;
                                    case 'Cinematography':
                                        movie.cinematography = value
                                        break;
                                    case 'Edited by':
                                        movie.editor = value;
                                        break;
                                    case 'Music by':
                                        movie.music = value;
                                        break;
                                    case 'Starring':
                                        movie.starring = value
                                        break;
                                    case 'Production companies':
                                        movie.production_company = value;
                                        break;
                                    case 'Distributed by':
                                        movie.distributor = value;
                                        break;
                                    case 'Release date':
                                        movie.releaseDate = value;
                                        break;
                                    case 'Running time':
                                        movie.runningTime = value;
                                        break;
                                    case 'Country':
                                        movie.country = value;
                                        break;
                                    case 'Language':
                                        movie.language = value;
                                        break;
                                    case 'Budget':
                                        movie.budget = value;
                                        break;
                                    case 'Box office':
                                        movie.box_office = value;
                                        break;
                                }
                            }
                        });
                        return movie
                    })
                }))

                fs.writeFileSync(`${file_name}.json`, JSON.stringify(records, null, 2))
            })
            .catch(error => {
                console.error("Fetch Error : ", error.message);
            })
    }
    catch (e) {
        console.log(e.message)
    }
}

module.exports = ScrapeMovieData