const fs = require('fs')
const CSVParser = require('@json2csv/plainjs')

let data = []

fs.readdirSync('json')
    .forEach((file) => {
        const content = fs.readFileSync(`json/${file}`, 'utf-8')
        // console.log(content)
        const _data = JSON.parse(content)
        data = data.concat(_data)
        // eslint-disable-next-line
        // require(path.join(__dirname, file)).initialize(sequelize, db)
    })

console.log(data.length)

const parser = new CSVParser.Parser();
const csv = parser.parse(data, {
    fields: [
        'title',
        'director',
        'writer',
        'producer',
        'screenplay',
        'cinematography',
        'editor',
        'music',
        'starring',
        'production_company',
        'distributor',
        'releaseDate',
        'runningTime',
        'country',
        'language',
        'budget',
        'box_office',
        'year'
    ].map((e) => ({
        label: e,
        value: (record) => record.title || null,
        default: null
    }))
});

fs.writeFileSync(`combined.csv`, csv)


