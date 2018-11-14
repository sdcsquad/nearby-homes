const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const homes = require('./models/Home');

const csvWriter = createCsvWriter({
  path: 'xyz.csv',
  header: [
    { id: 'date', title: 'DATE' },
    { id: 'status', title: 'STATUS' },
    { id: 'numberOfLikes', title: 'NUMBEROFLIKES' },
    { id: 'numberOfBathrooms', title: 'NUMBEROFBATHROOMS' },
    { id: 'numberOfBedrooms', title: 'NUMBEROFBEDROOMS' },
    { id: 'homeValue', title: 'HOMEVALUE' },
    { id: 'sqft', title: 'SQFT' },
    { id: 'streetName', title: 'STREETNAME' },
    { id: 'cityName', title: 'CITYNAME' },
    { id: 'stateName', title: 'STATENAME' },
    { id: 'zipCode', title: 'ZIPCODE' },
    { id: 'homeImage', title: 'HOMEIMAGE' },
  ],
});

const fakeHomes = [];

const createRandomNum = () => Math.floor(Math.random() * 20) + 1;

const selectRandomPhoto = () => `https://s3-us-west-1.amazonaws.com/fcc-nearby-homes/assets/images/home_${createRandomNum()}.jpg`;

const createFakeHomes = function createFakeHomes(num) {
  for (let i = 1; i < num + 1; i += 1) {
    const home = {
      dateOfPosting: faker.date.between('2018-05-01', '2018-10-25'),
      status: faker.random.arrayElement([
        'FOR SALE',
        'FORECLOSURE',
        'AUCTION',
        'OFF MARKET',
        'FOR RENT',
        'SOLD',
      ]),
      numberOfLikes: faker.random.number(200),
      numberOfBathroom: faker.random.number({
        min: 0,
        max: 4,
      }),
      numberOfBedrooms: faker.random.number({
        min: 0,
        max: 10,
      }),
      homeValue: faker.random.number({
        min: 100000,
        max: 4000000,
      }),
      sqft: faker.random.number({
        min: 300,
        max: 4000,
      }),
      streetName: faker.address.streetAddress(),
      cityName: faker.address.city(),
      stateName: faker.address.state(),
      zipCode: faker.address.zipCode(),
      homeImage: selectRandomPhoto(),
    };
    fakeHomes.push(home);
  }
};

createFakeHomes(100000);

csvWriter.writeRecords(fakeHomes)
  .then(() => {
    console.log('done');
  });
// const seed = () => homes.sync({ force: true }).then(() => {
//   createFakeHomes();
//   homes.bulkCreate(fakeHomes);
// });

// seed();