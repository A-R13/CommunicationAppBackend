import { newUser, requestHelper, requestClear } from './other';

import { requestAuthRegister } from './auth.test';

export function requestUserProfile (token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v2', { token, uId });
}

export function requestUsersAll(token: string) {
  return requestHelper('GET', '/channels/users/all/v2', { token });
}


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
  let user0;
  let user1;
  let user2;
  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Smith'); //uid = 0

  });

  afterEach(() => {
    requestClear();

  });

  test('Error return', () => {
    expect(requestUsersAll('abcd')).toStrictEqual({ error: expect.any(String) });

  })

  test('show user details when given a valid token', () => {
    user1 = requestAuthRegister('example2@gmail.com', 'Abcd1234', 'Jake', 'Doe');
    user2 = requestAuthRegister('example3@gmail.com', 'Abcd1234', 'Jacob', 'Doe');
    expect(requestUsersAll(user0.token)).toStrictEqual({
      userDetails: [
        {
          uid: 0,
          email: 'example1@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Smith',
          handleStr: 'bobsmith',
        }
      ]
    });

    expect(requestUsersAll(user0.token, user1.token)).toStrictEqual({
      userDetails: [
        {
          uid: 0,
          email: 'example2@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Smith',
          handlestr: 'bobsmith'
        },
        {
          uid: 1,
          email: 'example3@gmail.com',
          nameFirst: 'Jake',
          nameLast: 'Doe',
          handlestr: 'jakedoe',
        }
      ]

    });

    expect(requestUsersAll(user0.token, user1.token, user2.token)).toStrictEqual({
      userDetails: [
        {
          uid: 0,
          email: 'example1@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Smith',
          handleStr: 'bobsmith',
        },
        {
          uid: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Jake',
          nameLast: 'Doe',
          handleStr: 'jakedoe',
        },
        {
          uid: 2,
          email: 'example3@gmail.com',
          nameFirst: 'Jacob',
          nameLast: 'Doe',
          handleStr: 'jacobdoe',
        },
      ]
    });
  });

});
//tes remveed user