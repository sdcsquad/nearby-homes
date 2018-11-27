const express = require('express');
const cassandra = require('cassandra-driver');

const { PlainTextAuthProvider } = cassandra.auth;
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'neighborhood', authProvider: new PlainTextAuthProvider('cassandra', 'cassandra') });
const router = express.Router();

router.get('/:homeId', (req, res) => {
  let id;
  const homeIdString = req.params.homeId.toString();
  if (homeIdString.slice(0, 4).toLowerCase() === 'home') {
    const homeIdNum = Number.parseInt(homeIdString.slice(4), 10);
    if (homeIdNum > 0 && homeIdNum <= 10000001) {
      id = homeIdNum;
    } else {
      id = null;
    }
  } else if (Number.parseInt(req.params.homeId, 10) > 0
    && Number.parseInt(req.params.homeId, 10) <= 10000002) {
    id = Number.parseInt(req.params.homeId, 10);
  } else {
    id = null;
  }
  if (id !== null) {
    const query = 'SELECT * FROM neighborhood.homes where home_id = ?';
    return client.execute(query, [id], { prepare: true })
      .then((result) => {
        const singleHome = result.rows[0];
        const query2 = 'SELECT * FROM neighborhood.homes WHERE zipcode = ?';
        client.execute(query2, [singleHome.zipcode], { prepare: true })
          .then((newResult) => {
            const arr = [];
            for (let i = 0; i < 15; i += 1) {
              if (newResult.rows[i].home_id !== id) {
                arr.push(newResult.rows[i]);
              }
            }
            if (arr.length <= 1) {
              return res.status(404).json({ noHomeFound: 'No home found with that ID' });
            }
            return res.status(200).json(arr);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return res.status(404).json('No home found with that ID');
});

router.post('/', (req, res) => {
  const { body } = { body: req.body };
  const query = `INSERT INTO neighborhood.homes(home_id, home_name, dateOfPosting, status, numberOfLikes, numberOfBathroom, numberOfBedroom, homeValue, sqft, streetName, cityName, stateName, zipCode, homeImage) VALUES (${body.home_id}, ${body.home_name}, ${body.dateOfPosting}, ${body.status}, ${body.numberOfLikes}, ${body.numberOfBathroom}, ${body.numberOfBedroom}, ${body.homeValue}, ${body.sqft}, ${body.streetName}, ${body.cityName}, ${body.stateName}, ${body.zipCode}, ${body.homeImage})`;
  client.execute(query).then(() => res.status(200));
});

router.put('/:homeId', (req, res) => {
  const { body } = { body: req.body };
  let id;
  const homeIdString = req.params.homeId.toString();
  if (homeIdString.slice(0, 4).toLowerCase() === 'home') {
    const homeIdNum = Number.parseInt(homeIdString.slice(4), 10);
    if (homeIdNum > 0 && homeIdNum <= 10000001) {
      id = homeIdNum;
    } else {
      id = null;
    }
  } else if (Number.parseInt(req.params.homeId, 10) > 0
    && Number.parseInt(req.params.homeId, 10) <= 10000002) {
    id = Number.parseInt(req.params.homeId, 10);
  } else {
    id = null;
  }
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
  client.execute(query).then(() => res.status(200));
});

router.delete('/:homeId', (req, res) => {
  let id;
  const homeIdString = req.params.homeId.toString();
  if (homeIdString.slice(0, 4).toLowerCase() === 'home') {
    const homeIdNum = Number.parseInt(homeIdString.slice(4), 10);
    if (homeIdNum > 0 && homeIdNum <= 10000001) {
      id = homeIdNum;
    } else {
      id = null;
    }
  } else if (Number.parseInt(req.params.homeId, 10) > 0
    && Number.parseInt(req.params.homeId, 10) <= 10000002) {
    id = Number.parseInt(req.params.homeId, 10);
  } else {
    id = null;
  }
  if (id === null) {
    res.status(404).json('No home found with that ID');
  }
  const query = `DELETE FROM neighborhood.homes WHERE home_id = ${id}`;
  client.execute(query).then(() => res.status(200));
});

module.exports = router;
