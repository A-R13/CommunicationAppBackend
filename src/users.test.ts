import { newUser } from './other';
import { requestClear, requestAuthRegister, requestUserProfile, requestUserSetName, requestUsersAll } from './wrapperFunctions';

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

  test('uId doesnt refer to valid user', () => {
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

describe('Testing for userSetNameV1', () => {
  let user1: newUser;

  beforeEach(() => {
    requestClear();
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
  });

  // successfully reset first name, last name
  test('successfully reset names', () => {
    expect(requestUserSetName(user1.token, 'geoffrey', 'mok')).toStrictEqual({});
    expect(requestUserProfile(user1.token, user1.authUserId)).toStrictEqual(
      {
        user: {
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'geoffrey',
          nameLast: 'mok',
          handleStr: 'nicoledoe'
        }
      }
    );
  });

  // token is invalid
  test('throw error if invalid token', () => {
    expect(requestUserSetName('a', 'geoffrey', 'mok')).toStrictEqual({ error: expect.any(String) });
  });

  // length of first name is not less than 50 characters
  test('throw error if first name is too long', () => {
    expect(requestUserSetName(user1.token, 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', 'mok')).toStrictEqual({ error: expect.any(String) });
  });

  // length of first name is not 1 character or greater (blank)
  test('throw error if first name is blank', () => {
    expect(requestUserSetName(user1.token, '', 'mok')).toStrictEqual({ error: expect.any(String) });
  });

  // length of last name is not less than 50 characters
  test('throw error if last name is too long', () => {
    expect(requestUserSetName(user1.token, 'geoffrey', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz')).toStrictEqual({ error: expect.any(String) });
  });

  // length of last name is not 1 character or greater (blank)
  test('throw error if last name is blank', () => {
    expect(requestUserSetName(user1.token, 'mok', '')).toStrictEqual({ error: expect.any(String) });
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
