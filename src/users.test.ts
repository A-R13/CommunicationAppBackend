import { newUser } from './other';
import { requestClear, requestAuthRegister, requestUserProfile, requestUsersAll, requestUserSetHandle } from './wrapperFunctions';

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

describe('userSetHandleV1 tests', () => {
  let user0: newUser;
  let user1: newUser;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Smith');
    user1 = requestAuthRegister('example2@gmail.com', 'EFGH5678', 'Carl', 'White');
  });

  // successfully changed the handle of user
  test('sucessfully changed the handle of user', () => {
    expect(requestUserSetHandle(user0.token, 'bettyboop')).toStrictEqual({});
    expect(requestUserProfile(user0.token, user0.authUserId)).toStrictEqual(
      {
        user: {
            uId: 0,
            email: 'example1@gmail.com',
            nameFirst: 'Bob',
            nameLast: 'Smith',
            handleStr: 'bettyboop',        
        }
      }
    );
  });

  // handle string length is too short
  test('throw error if handle is too short', () => {
    expect(requestUserSetHandle(user0.token, 'hi')).toStrictEqual({ error: expect.any(String)});
  });

  // handle string length is too long 
  test('throw error if handle is too long', () => {
    expect(requestUserSetHandle(user0.token, 'abcdefghijklmnopqrstuvwxyz')).toStrictEqual({ error: expect.any(String)});
  });

  // handle string contains non-alphanumeric characters 
  test('throw error if handle contains non-alphanumeric characters', () => {
    expect(requestUserSetHandle(user0.token, 'carlwhite!')).toStrictEqual({ error: expect.any(String)});
  });

  // handle string already exists 
  test('throw error if handle already exists', () => {
    expect(requestUserSetHandle(user0.token, 'carlwhite')).toStrictEqual({ error: expect.any(String)});
  });

  // token is invalid 
  test('throw error if token is invalid', () => {
    expect(requestUserSetHandle('a', 'bettyboop')).toStrictEqual({ error: expect.any(String)});
  });


});