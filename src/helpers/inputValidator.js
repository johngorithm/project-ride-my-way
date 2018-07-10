
const validateInput = (req, res, next) => {
  // destructure user input
  let inputData;
  if (req.originalUrl === '/api/v1/auth/signup' && req.method === 'POST') {
    const {
      username,
      firstname,
      lastname,
      email,
      password,
    } = req.body;

    // new object for validation
    inputData = {
      username, firstname, lastname, email, password,
    };
  } else if (req.originalUrl === '/api/v1/auth/login' && req.method === 'POST') {
    const {
      username,
      password,
    } = req.body;

    // new object for validation
    inputData = {
      username, password,
    };
  } else if (req.originalUrl === '/api/v1/users/rides' && req.method === 'POST') {
    const {
      destination,
      time,
      date,
      takeOffVenue,
    } = req.body;

    // new object for validation
    inputData = {
      destination, time, date, takeOffVenue,
    };
  }

  const fieldErrors = {};
  let isValidData = true;

  // do the checks now
  Object.entries(inputData).forEach((field) => {
    const [fieldName, fieldData] = field;

    if (typeof fieldData === 'string') {
      if (fieldData.trim() === '') {
        fieldErrors[fieldName] = `${fieldName} is required`;
        isValidData = false;
      } else if (fieldName === 'password' && fieldData.length < 6) {
        // TODO: password strent validation
        fieldErrors[fieldName] = 'password must NOT be less than 6 characters';
        isValidData = false;
      } else if (fieldName === 'email') {
        const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regEx.test(fieldData)) {
          fieldErrors[fieldName] = 'email address is invalid';
          isValidData = false;
        }
      }
      // TODO: Validate date AND time
    } else if (fieldData === undefined) {
      fieldErrors[fieldName] = `${fieldName} is required`;
      isValidData = false;
    } else {
      fieldErrors[fieldName] = `${fieldName} contains invalid data`;
      isValidData = false;
    }
  });

  if (isValidData) {
    next();
  } else {
    res.status(400).json({
      message: 'You submitted Invalid Data!',
      status: false,
      data: req.body,
      errors: fieldErrors,
    });
  }
};


export default validateInput;
