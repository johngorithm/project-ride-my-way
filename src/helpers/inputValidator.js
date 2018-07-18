

class ValidateInput {
  static validateUser(req, res, next) {
    // destructure user input
    let inputData;
    if (req.originalUrl === '/api/v1/auth/signup' && req.method === 'POST') {
      inputData = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      };
    } else if (req.originalUrl === '/api/v1/auth/login' && req.method === 'POST') {
      inputData = {
        username: req.body.username,
        password: req.body.password,
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
        } else {
          return true;
        }
        // TODO: Validate date AND time
      } else if (fieldData === undefined) {
        fieldErrors[fieldName] = `${fieldName} is required`;
        isValidData = false;
      } else {
        fieldErrors[fieldName] = `${fieldName} contains invalid data`;
        isValidData = false;
      }
      return true;
    });

    if (isValidData) {
      next();
    } else {
      res.status(400).json({
        message: 'You submitted Invalid Data!',
        status: false,
        data: req.body,
        error: fieldErrors,
      });
    }
  }


  static validateRide(req, res, next) {
    const inputData = {
      destination: req.body.destination,
      time: req.body.time,
      date: req.body.date,
      takeOffVenue: req.body.takeOffVenue,
      capacity: req.body.capacity,
    };

    const fieldErrors = {};
    let isValidData = true;

    // do the checks now
    Object.entries(inputData).forEach((field) => {
      const [fieldName, fieldData] = field;

      if (typeof fieldData === 'string') {
        if (fieldData.trim() === '') {
          fieldErrors[fieldName] = `${fieldName} is required`;
          isValidData = false;
        } else if (fieldName === 'capacity') {
          if (isNaN(Number(fieldData))) {
            fieldErrors[fieldName] = `${fieldData} : capacity can only be a positive integer`;
            isValidData = false;
          } else if (fieldData % 1 !== 0) {
            fieldErrors[fieldName] = `${fieldData} : capacity can only be a positive integer`;
            isValidData = false;
          } else {
            return true;
          }
        } else {
          return true;
        }
        // TODO: Validate date AND time
      } else if (fieldData === undefined) {
        fieldErrors[fieldName] = `${fieldName} is required`;
        isValidData = false;
      } else if (typeof fieldData === 'number' && fieldName === 'capacity') {
        if (fieldData % 1 !== 0) {
          fieldErrors[fieldName] = `${fieldData} : capacity can only be a positive integer`;
          isValidData = false;
        } else {
          return true;
        }
      } else {
        fieldErrors[fieldName] = `${fieldName} contains invalid data`;
        isValidData = false;
      }
      return true;
    });

    if (isValidData) {
      next();
    } else {
      res.status(400).json({
        message: 'You submitted Invalid Data!',
        status: false,
        data: req.body,
        error: fieldErrors,
      });
    }
  }
}

export default ValidateInput;
