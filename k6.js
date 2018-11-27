/* eslint-disable-next-line */
import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '10s',
};

export default function () {
  const random = Math.floor(Math.random() * (10000000 - 9000000) + 9000000);
  http.get(`http://localhost:3003/api/nearbyHomes/${random}`);
}
