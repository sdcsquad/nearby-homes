const express = require('express');
const Home = require('../../../database/models/Home');

const router = express.Router();
// const createRandomId = () => Math.floor(Math.random() * 100) + 1;

/* for testing */
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

router.get('/:homeId', (req, res) => {
  let id;
  const homeIdString = req.params.homeId.toString();
  if (homeIdString.slice(0, 4) === 'home') {
    if (Number.parseInt(homeIdString.slice(4), 10) > 0
      && Number.parseInt(homeIdString.slice(4), 10) <= 10000001) {
      id = Number.parseInt(homeIdString.slice(4), 10);
    } else {
      id = null;
    }
  } else if (Number.parseInt(req.params.homeId, 10) > 0
    && Number.parseInt(req.params.homeId, 10) <= 10000001) {
    id = Number.parseInt(req.params.homeId, 10);
  } else {
    id = null;
  }
  // const randomId = createRandomId();
  Home.findByPk(id).then((home) => {
    if (!home) {
      return res.status(404).json({ noHomeFound: 'No home found with that ID' });
    }
    const { zipCode } = home;
    Home.findAll({ where: { zipCode }, exclude: [{ id }] }).then((homes) => {
      if (!homes) {
        return res.status(404).json({ noHomesFound: 'no homes found with that ZIP Code' });
      }
      return res.status(200).json(homes);
    });
    return false;
  });
});

router.post('/:homeId', (req, res) => {
  res.status(405).send('Can\t POST to this route');
});

router.put('/:homeId', (req, res) => {
  res.status(405).send('Can\t PUT to this route');
});

router.delete('/:homeId', (req, res) => {
  res.status(405).send('Can\t DELETE from this route');
});

module.exports = router;
