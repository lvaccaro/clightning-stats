const random = require('random-js');

const engine = random.engines.mt19937().autoSeed();
const uuid4_1 = random.uuid4(engine); // eslint-disable-line camelcase
const uuid4_2 = random.uuid4(engine); // eslint-disable-line camelcase
console.log(uuid4_1);
console.log(uuid4_2);
