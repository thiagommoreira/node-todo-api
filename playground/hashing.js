const bcrypt = require('bcryptjs');

let password = '123asd';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash);
//     });
// });

let hashedPw = '$2a$10$uwLCCTMjhdYwR.Tm/o5C8Ob6bZTB9B8PcnTdzdAws18w0zwVVgYSa';

bcrypt.compare(password, hashedPw, (err, res) => { //res boolean
  console.log(res);
});
