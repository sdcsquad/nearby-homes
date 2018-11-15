const express = require('express');
const Home = require('../../../database/models/Home');

const router = express.Router();
const createRandomId = () => Math.floor(Math.random() * 100) + 1;

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
  if (homeIdString.slice(0, 4).toLowerCase() === 'home') {
    const homeIdNum = Number.parseInt(homeIdString.slice(4), 10);
    if (homeIdNum > 0 && homeIdNum <= 10000001) {
      id = homeIdNum;
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
