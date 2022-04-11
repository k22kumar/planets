const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    // koi disposition is if its been observed by kepler, koi_insol is amount of stellar flux, koi_prad
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

fs.createReadStream('kepler_data.csv')
.pipe(parse({
    // treat lines that start with this character as comments
    comment: '#',
    // return each row as a JS object with key value pairs
    columns: true
}))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) habitablePlanets.push(data);
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name']
        }))
        console.log(`${habitablePlanets.length} habitable planets found!`);
    });
parse();
