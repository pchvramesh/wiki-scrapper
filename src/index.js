const scrapper = require('./wiki')

const movies = ['American', 'Australian', 'Bangladeshi', 'British', 'Canadian', 'Chinese', 'French', 'German', 'Bengali', 'Gujarati', 'Hindi', 'Kannada', 'Malayalam', 'Marathi', 'Punjabi', 'Tamil', 'Telugu', 'Tulu', 'Japanese', 'Malaysian', 'Pakistani', 'Philippine', 'Russian', 'South_Korean', 'Spanish', 'Turkish']

for (let i = 0; i < movies.length; i++) {
    setTimeout(() => {
        scrapper(2022, movies[i])
    }, (5000 * (i + 1)))
}