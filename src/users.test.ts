import { newUser } from './other';
import { requestClear, requestAuthRegister, requestUserProfile, requestUsersAll, requestUserSetEmail } from './wrapperFunctions';

describe('Testing for userProfileV2', () => {
  let user1: newUser;
  let user2: newUser;
  let user3: newUser;

  beforeEach(() => {
    requestClear();
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'geoff', 'Doe');
  });

  test('Base case', () => {
    /** input a data point from getData */
    expect(requestUserProfile(user1.token, user1.authUserId)).toStrictEqual(
      {
        user: {
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'Doe',
          handleStr: 'nicoledoe'
        }
      }
    );
  });

  test('Testing a larger data base which runs', () => {
    expect(requestUserProfile(user3.token, user2.authUserId)).toStrictEqual(
      {
        user: {
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Doe',
          handleStr: 'bobdoe',
        }
      }
    );
  });

  test('uId doesnt refer to valid  user', () => {
    expect(requestUserProfile(user1.token, 4)).toStrictEqual({ error: 'error' });
  });

  test('authUserId is invalid test', () => {
    expect(requestUserProfile('randomstring', user1.authUserId)).toStrictEqual({ error: 'error' });
  });

  test('uID isnt valid', () => {
    expect(requestUserProfile(user2.token, 5)).toStrictEqual({ error: 'error' });
  });

  test('AuthuserId is invalid', () => {
    expect(requestUserProfile('Randomstring', user2.authUserId)).toStrictEqual({ error: 'error' });
  });
});

describe('usersAllv1 tests', () => {
  let user0: newUser;
  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Smith');// uid = 0
  });

  afterEach(() => {
    requestClear();
  });

  test('Error return', () => {
    expect(requestUsersAll('abcd')).toStrictEqual({ error: expect.any(String) });
  });

  test('show user details when given a valid token', () => {
    expect(requestUsersAll(user0.token)).toStrictEqual({
      users: [
        {
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Smith',
          handleStr: 'bobsmith',
        }
      ]
    });
    requestAuthRegister('example2@gmail.com', 'Abcd1234', 'Jake', 'Doe');
    expect(requestUsersAll(user0.token)).toStrictEqual({
      users: [
        {
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Smith',
          handleStr: 'bobsmith'
        },
        {
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Jake',
          nameLast: 'Doe',
          handleStr: 'jakedoe',
        }
      ]

    });
    requestAuthRegister('example3@gmail.com', 'Abcd1234', 'Jacob', 'Doe');
    expect(requestUsersAll(user0.token)).toStrictEqual({
      users: [
        {
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Smith',
          handleStr: 'bobsmith',
        },
        {
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Jake',
          nameLast: 'Doe',
          handleStr: 'jakedoe',
        },
        {
          uId: 2,
          email: 'example3@gmail.com',
          nameFirst: 'Jacob',
          nameLast: 'Doe',
          handleStr: 'jacobdoe',
        },
      ]
    });
  });
});

describe('userSetEmailV1 tests', () => {
  let user0: newUser;
  let user1: newUser;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Smith');
    user1 = requestAuthRegister('example2@gmail.com', 'EFGH5678', 'Carl', 'White');
  });

  // successfully changed email
  test('succesfully changed email', () => {
    expect(requestUserSetEmail(user0.token, 'example0@gmail.com')).toStrictEqual({});
    expect(requestUserProfile(user0.token, user0.authUserId)).toStrictEqual(
      {
        user:
          {
            uId: 0,
            email: 'example0@gmail.com',
            nameFirst: 'Bob',
            nameLast: 'Smith',
            handleStr: 'bobsmith',
          }
      }
    );
  });

  // email is in the invalid format
  test('throw error if email is in the invalid format', () => {
    expect(requestUserSetEmail(user0.token, 'example@gmail...com')).toStrictEqual({ error: expect.any(String) });
  });

  // no email has been inputted
  test('throw error if no email has been inputted', () => {
    expect(requestUserSetEmail(user0.token, '')).toStrictEqual({ error: expect.any(String) });
  });

  // invalid token
  test('throw error if the token is invalid', () => {
    expect(requestUserSetEmail('a', 'example0@gmail.com')).toStrictEqual({ error: expect.any(String) });
  });

  // email already exists
  test('throw error if no email is already in use', () => {
    expect(requestUserSetEmail(user0.token, 'example2@gmail.com')).toStrictEqual({ error: expect.any(String) });
  });

  // email isn't being changed (sub-category)
  test('throw error if the new email has not been changed', () => {
    expect(requestUserSetEmail(user0.token, 'example1@gmail.com')).toStrictEqual({ error: expect.any(String) });
  });
});
