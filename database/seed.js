const fs = require('fs');
const faker = require('faker');

const padToThree = (number) => {
  let num;
  if (number <= 9999) {
    num = (`00${number}`).slice(-3);
  }
  return num;
};

const createRandomNum = () => padToThree(Math.floor(Math.random() * 99));

const selectRandomPhoto = () => `https://s3-us-west-1.amazonaws.com/sdc-houses/${createRandomNum()}.jpg`;

const wstream = fs.createWriteStream('homes.tsv');

// const header = {
// home_id: 'HOME_ID',
// home_name: 'HOME_NAME',
// dateOfPosting: 'DATEOFPOSTING',
// status: 'STATUS',
// numberOfLikes: 'NUMBEROFLIKES',
// numberOfBathrooms: 'NUMBEROFBATHROOM',
// numberOfBedrooms: 'NUMBEROFBEDROOM',
// homeValue: 'HOMEVALUE',
// sqft: 'SQFT',
// streetName: 'STREETNAME',
// cityName: 'CITYNAME',
// stateName: 'STATENAME',
// zipCode: 'ZIPCODE',
// homeImage: 'HOMEIMAGE',
// };

const createFakeHomes = function createFakeHomes(i) {
  /* eslint-disable */
  for (; i < 10000002; i += 1) {
    const home_id = i;
    const home_name = `home${i}`;
    /* eslint-enable */
    const dateOfPosting = faker.date.between('2018-05-01', '2018-10-25');
    const status = faker.random.arrayElement([
      'FOR SALE',
      'FORECLOSURE',
      'AUCTION',
      'OFF MARKET',
      'FOR RENT',
      'SOLD',
    ]);
    const numberOfLikes = faker.random.number(200);
    const numberOfBathroom = faker.random.number({
      min: 0,
      max: 4,
    });
    const numberOfBedroom = faker.random.number({
      min: 1,
      max: 10,
    });
    const homeValue = faker.random.number({
      min: 100000,
      max: 4000000,
    });
    const sqft = faker.random.number({
      min: 300,
      max: 4000,
    });
    const streetName = faker.address.streetAddress();
    const cityName = faker.address.city();
    const stateName = faker.address.state();
    const zipCode = faker.address.zipCode('#####');
    const homeImage = selectRandomPhoto();
    /* eslint-disable */
    if (!wstream.write(`${home_id}\t${home_name}\t${dateOfPosting}\t${status}\t${numberOfLikes}\t${numberOfBathroom}\t${numberOfBedroom}\t${homeValue}\t${sqft}\t${streetName}\t${cityName}\t${stateName}\t${zipCode}\t${homeImage}\n`)) {
      wstream.once('drain', () => createFakeHomes(i + 1));
      /* eslint-enable */
      return;
    }
  }
  wstream.end();
};

createFakeHomes(1);
