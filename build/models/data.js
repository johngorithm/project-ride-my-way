'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Users = {
  johngorithm: {
    displayName: 'John Obi',
    imageUrl: '../../public/sample_image.jpg',
    email: 'johngorithm@gmail.com',
    phone: '09030756235',
    regDate: '01/02/2015',
    changedDate: '03/06/2018',
    friends: ['tobe', 'muna01', 'handsome', 'deraviv', 'peace11'],
    password: 'moneyme'
  },
  deraviv: {
    displayName: 'Dera Vivian',
    imageUrl: '../../public/sample_image.jpg',
    email: 'deraviv@gmail.com',
    phone: '08183323628',
    regDate: '01/02/2016',
    changedDate: '03/01/2018',
    friends: ['tobe', 'muna01', 'handsome', 'johngorithm'],
    password: 'lovers'
  },
  muna01: {
    displayName: 'Muna Jame',
    imageUrl: '../../public/sample_image.jpg',
    email: 'james@gmail.com',
    phone: '08183323628',
    regDate: '01/02/2016',
    changedDate: '03/01/2018',
    friends: ['tobe', 'handsome', 'deraviv', 'johngorithm', 'kelvin'],
    password: 'james55'
  },
  femoo: {
    displayName: 'Femi',
    imageUrl: '../../public/sample_image.jpg',
    email: 'femi@gmail.com',
    phone: '08183323628',
    regDate: '01/02/2016',
    changedDate: '03/01/2018',
    friends: ['tobe', 'handsome', 'deraviv', 'johngorithm', 'kelvin', 'muna01'],
    password: 'james55'
  },
  lucybae: {
    displayName: 'Lucy',
    imageUrl: '../../public/sample_image.jpg',
    email: 'lucy@gmail.com',
    phone: '08183323628',
    regDate: '01/02/2016',
    changedDate: '03/01/2018',
    friends: ['femoo', 'handsome', 'deraviv', 'johngorithm', 'kelvin'],
    password: 'james55'
  },
  newman: {
    displayName: 'Philip',
    imageUrl: '../../public/sample_image.jpg',
    email: 'philip@gmail.com',
    phone: '08183323628',
    regDate: '01/02/2016',
    changedDate: '03/01/2018',
    friends: ['handsome', 'femoo', 'lucybae', 'kelvin'],
    password: 'james55'
  }
};

var Rides = {
  1: {
    destination: 'Ikeja',
    date: '19/6/2018',
    time: '12:30 PM',
    creator: {
      username: 'johngorithm',
      displayName: 'John Obi'
    },
    requests: [{
      passenger: {
        username: 'tobe',
        displayName: 'Tobechukwu'
      },
      id: 1,
      isMyFriend: true,
      status: 'pending',
      requestDate: '12/6/2018'
    }, {
      passenger: {
        username: 'peace11',
        displayName: 'Peace'
      },
      id: 2,
      isMyFriend: true,
      status: 'pending',
      requestDate: '12/6/2018'
    }]
  },
  2: {
    destination: 'Ogba',
    date: '19/6/2018',
    time: '12:30 PM',
    creator: {
      username: 'femoo',
      displayName: 'Femi'
    },
    requests: [{
      passenger: {
        username: 'ife22',
        displayName: 'Ifeyemi'
      },
      id: 1,
      isMyFriend: true,
      status: 'pending',
      requestDate: '12/6/2018'
    }, {
      passenger: {
        username: 'dozie44',
        displayName: 'Dozie'
      },
      id: 2,
      isMyFriend: false,
      status: 'pending',
      requestDate: '12/6/2018'
    }]
  },
  3: {
    destination: 'Ikoyi',
    date: '19/6/2018',
    time: '12:30 PM',
    creator: {
      username: 'lucybae',
      displayName: 'Lucy'
    },
    requests: [{
      passenger: {
        username: 'raphie',
        displayName: 'Adele'
      },
      id: 1,
      isMyFriend: true,
      status: 'pending',
      requestDate: '12/6/2018'
    }, {
      passenger: {
        username: 'raph',
        displayName: 'Raphael'
      },
      id: 2,
      isMyFriend: false,
      status: 'pending',
      requestDate: '12/6/2018'
    }, {
      passenger: {
        username: 'gimmy20',
        displayName: 'Gimmy'
      },
      id: 3,
      isMyFriend: true,
      status: 'pending',
      requestDate: '12/6/2018'
    }]
  },
  4: {
    destination: 'Ikorodu',
    date: '19/6/2018',
    time: '12:30 PM',
    creator: {
      username: 'newman',
      displayName: 'Philip'
    },
    requests: [{
      passenger: {
        username: 'deraviv',
        displayName: 'Vivian'
      },
      id: 1,
      isMyFriend: true,
      status: 'pending',
      requestDate: '12/6/2018'
    }]
  }

};

exports.Rides = Rides;
exports.Users = Users;