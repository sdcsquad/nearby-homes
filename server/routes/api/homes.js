const express = require('express');
const cassandra = require('cassandra-driver');
const Home = require('../../../database/models/Home');

const { PlainTextAuthProvider } = cassandra.auth;
const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], authProvider: new PlainTextAuthProvider('cassandra', 'cassandra') });
const router = express.Router();
const createRandomId = () => Math.floor(Math.random() * 100) + 1;

/* for testing
router.get('/', (req, res) => {
  Home.findByPk(1).then((home) => {
    if (!home) {
      return res.status(404).json({ noHomeFound: 'No home found with that ID' });
    }
    const { zipCode } = home;
    Home.findAll({ where: { zipCode } }).then((homes) => {
      if (!homes) {
        return res.status(404).json({ noHomesFound: 'no homes found with that ZIP Code' });
      }
      return res.status(200).send(homes);
    });
    return false;
  });
});
*/

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
  // const randomId = createRandomId();
  const query = `SELECT * FROM neighborhood.homes where home_id=${id}`;
  client.execute(query)
    .then((result) => {
      // console.log(result.rows[0]);
      const singleHome = result.rows[0];
      const query2 = `SELECT * FROM neighborhood.homes WHERE zipcode=${singleHome.zipcode}`;
      client.execute(query2)
        .then((newResult) => {
          const arr = [];
          let i = 0;
          while (i < 5) {
            if (newResult.rows[i].home_id !== id) {
              arr.push(newResult.rows[i]);
              i += 1;
            }
          }
          if (arr.length <= 1) {
            res.status(404).json({ noHomeFound: 'No home found with that ID' });
          } else {
            res.status(200).json(arr);
          }
        });
    });
  // Home.findByPk(id).then((home) => {
  //   if (!home) {
  //     return res.status(404).json({ noHomeFound: 'No home found with that ID' });
  //   }
  //   const { zipCode } = home;
  //   Home.findAll({ where: { zipCode }, exclude: [{ id }] }).then((homes) => {
  //     if (!homes) {
  //       return res.status(404).json({ noHomesFound: 'no homes found with that ZIP Code' });
  //     }
  //     return res.status(200).json(homes);
  //   });
  //   return false;
  // });
});

router.post('/', (req, res) => {
  const { body } = { body: req.body };
  Home.create(body)
    .then(() => {
      res.status(200);
    });
});

router.put('/:homeId', (req, res) => {
  const { body } = { body: req.body };
  Home.update(body, { where: { id: req.params.homeId } })
    .then(() => {
      res.status(200);
    });
});

router.delete('/:homeId', (req, res) => {
  const { homeId } = req.params.homeId;
  Home.destroy({ where: { id: homeId } })
    .then(() => {
      res.status(200);
    });
});

module.exports = router;
