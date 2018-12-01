const express = require('express');
const cassandra = require('cassandra-driver');

const { types: distance } = cassandra;

const options = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  contactPoints: [
    process.env.DB_CONTACT,
  ],
  keyspace: process.env.DB_KEYSPACE,
  pooling: {
    setMaxRequestsPerConnection: {
      [distance.local]: 32768,
      [distance.remote]: 2048,
    },
  },
};
const client = new cassandra.Client(options);
const router = express.Router();

const padToZip = (string) => {
  let num = string;
  if (string.length < 5) {
    while (num.length < 5) {
      num = `0${num}`;
    }
  }
  return num;
};

const parseHomeAndCheckRange = (string) => {
  if (string.slice(0, 4).toLowerCase() === 'home') {
    const num = Number.parseInt(string.slice(4), 10);
    if (num > 0 && num < 10000002) {
      return num;
    }
    return null;
  }
  const num = Number.parseInt(string, 10);
  if (num > 0 && num < 10000002) {
    return num;
  }
  return null;
};

router.get('/:homeId', (req, res) => {
  const id = parseHomeAndCheckRange(req.params.homeId.toString());
  if (id) {
    const query = 'SELECT zipcode FROM neighborhood.homes where home_id = ?';
    client.execute(query, [id], { prepare: true })
      .then((result) => {
        const singleZip = result.rows[0].zipcode;
        const query2 = 'SELECT * FROM neighborhood.homes WHERE zipcode = ? LIMIT 10';
        client.execute(query2, [singleZip], { prepare: true })
          .then((newResult) => {
            const arr = [];
            for (let i = 0; i < newResult.rows.length; i += 1) {
              if (newResult.rows[i].home_id !== id) {
                arr.push(newResult.rows[i]);
              }
            }
            if (arr.length <= 1) {
              res.status(404).json({ noHomeFound: 'No home found with that ID' });
            }
            res.status(200).json(arr);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.status(404).json('No home found with that ID');
});

router.post('/', (req, res) => {
  const { body } = { body: req.body };
  const query = `INSERT INTO neighborhood.homes(home_id, home_name, dateOfPosting, status, numberOfLikes, numberOfBathroom, numberOfBedroom, homeValue, sqft, streetName, cityName, stateName, zipCode, homeImage) VALUES (${body.home_id}, ${body.home_name}, ${body.dateOfPosting}, ${body.status}, ${body.numberOfLikes}, ${body.numberOfBathroom}, ${body.numberOfBedroom}, ${body.homeValue}, ${body.sqft}, ${body.streetName}, ${body.cityName}, ${body.stateName}, ${body.zipCode}, ${body.homeImage})`;
  client.execute(query).then(() => res.status(200)).catch(err => console.log(err));
});

router.put('/:homeId', (req, res) => {
  const { body } = { body: req.body };
  const id = parseHomeAndCheckRange(req.params.homeId.toString());
  if (id === null) {
    res.status(404).json('No home found with that ID');
  }
  const query = `UPDATE neighborhood.homes
  SET home_name = ${body.home_name},
  dateOfPosting = ${body.dateOfPosting},
  status = ${body.status},
  numberOfLikes = ${body.numberOfLikes},
  numberOfBathroom = ${body.numberOfBathroom},
  numberOfBedroom = ${body.numberOfBedroom},
  homeValue = ${body.homeValue},
  sqft = ${body.sqft},
  streetName = ${body.streetName},
  cityName = ${body.cityName},
  stateName = ${body.stateName},
  zipCode = ${body.zipCode},
  homeImage = ${body.homeImage}
  WHERE home_id = ${id}`;
  client.execute(query).then(() => res.status(200)).catch(err => console.log(err));
});

router.delete('/:homeId', (req, res) => {
  const id = parseHomeAndCheckRange(req.params.homeId.toString());
  if (id === null) {
    res.status(404).json('No home found with that ID');
  }
  const query = `DELETE FROM neighborhood.homes WHERE home_id = ${id}`;
  client.execute(query).then(() => res.status(200)).catch(err => console.log(err));
});

module.exports = router;
