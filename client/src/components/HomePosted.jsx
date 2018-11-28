import React from 'react';

const getPostedDateFromNow = (dateOfPosting) => {
  const dateArr = dateOfPosting.split('T');
  const date = dateArr[0].replace(/-/g, '/');
  const currTime = new Date();
  const postDate = new Date(date);
  const timeDiff = Math.abs(currTime.getTime() - postDate.getTime());
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return dayDiff;
};

const HomePosted = ({ home }) => {
  return home.status === 'OFF MARKET' ? (
    <li className="photo-count">1 photo</li>
  ) : (
    <div className="home-posted-date">
      {getPostedDateFromNow(home.dateofposting)} days on Zillow
    </div>
  );
};

export default HomePosted;
