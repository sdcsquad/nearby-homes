const generateId = (userContext, events, done) => {
  const randomNumber = Math.floor(Math.random() * (10000000 - 9000000) + 9000000);
  userContext.vars.id = randomNumber;
  return done();
};

module.exports = {
  generateId,
};
