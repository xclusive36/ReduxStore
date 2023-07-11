const jwt = require('jsonwebtoken'); // import jwt package

const secret = 'mysecretsshhhhh'; // set secret to 'mysecretsshhhhh'
const expiration = '2h'; // set expiration to '2h'

module.exports = { // export authMiddleware and signToken functions
  authMiddleware: function ({ req }) { // create authMiddleware function
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization; // set token to req.body.token, req.query.token, or req.headers.authorization

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) { // if req.headers.authorization exists
      token = token.split(' ').pop().trim(); // set token to token.split(' ').pop().trim()
    }

    if (!token) { // if token doesn't exist
      return req; // return req
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration }); // set data to jwt.verify(token, secret, { maxAge: expiration })
      req.user = data; // set req.user to data
    } catch { // catch error
      console.log('Invalid token'); // console.log('Invalid token')
    }

    return req; // return req object
  },
  signToken: function ({ firstName, email, _id }) { // create signToken function
    const payload = { firstName, email, _id }; // set payload to { firstName, email, _id }

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration }); // return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
  },
};
