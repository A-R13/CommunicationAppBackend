import { requestClear, requestAuthRegister, requestAuthLogin, requestAuthLogout } from './wrapperFunctions';
// Function Wrappers using above function

requestClear(); // Need to call it here before calling it in the beforeEach for some reason.

beforeEach(() => {
  requestClear();

});

describe('Testing authRegister function', () => {
  test('Testing successful registration', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
    expect(user).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
  });

  test('Testing successful registration (Removing Non alpha-Numeric)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya12$#', 'Rana31');
    expect(user).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
  });

  test('Testing successful registration (Multiple Users, Unique ID and token)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
    const user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Aditya12', 'Rana21');
    expect(user).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
    expect(user2).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number)
      });

    expect(user2.authUserId).not.toBe(user.authUserId);
    expect(user2.token).not.toBe(user.token);
  });

  test('Testing failed registration (password being too short)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABC12', 'Aditya', 'Rana');
    expect(user).toStrictEqual({ error: expect.any(String) });
  });

  test('Testing failed registration Invalid email', () => {
    const user = requestAuthRegister('examplegmail.comm', 'ABC12', 'Aditya', 'Rana');
    expect(user).toStrictEqual({ error: expect.any(String) });
  });

  test('Testing failed registration (email already used by another user)', () => {
    requestAuthRegister('example2@gmail.com', 'ABCD12', 'Aditya', 'Rana');
    const user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
    expect(user2).toStrictEqual({ error: expect.any(String) });
  });

  test('Testing Failed registration (no first name)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABC123', '', 'Rana');
    expect(user).toStrictEqual({ error: expect.any(String) });
  });

  test('Testing failed registration (no surname)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABC123', 'Aditya', '');
    expect(user).toStrictEqual({ error: expect.any(String) });
  });

  test('Testing failed registration (name is too long)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABC123', 'Adityasdqwasdasdqed12341dsacdacasdadw13ascqavrsdfsa', 'Rana');
    expect(user).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Testing authLogin function', () => {
  // Testing login details are valid (registered)
  test('Testing successful login', () => {
    requestAuthRegister('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
    const login = requestAuthLogin('example@gmail.com', 'ABCD1234');
    expect(login).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
  });

  // Email and password are valid/registered, but don't match (for different users)
  test("Testing failed login (registered email and password don't match)", () => {
    requestAuthRegister('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
    requestAuthRegister('example2@gmail.com', 'WXYZ5678', 'Aditya', 'Rana12');
    const login = requestAuthLogin('example@gmail.com', 'WXYZ5678');
    expect(login).toStrictEqual({ error: expect.any(String) });
  });

  // Email (right) / Password (does not exist)
  test('Testing failed login (password does not exist)', () => {
    requestAuthRegister('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
    const login = requestAuthLogin('example@gmail.com', 'QWERTY');
    expect(login).toStrictEqual({ error: expect.any(String) });
  });

  // Email (does not exist) / Password (null)
  test('Testing failed login (email does not exist)', () => {
    requestAuthRegister('example@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
    const login = requestAuthLogin('csesoc@gmail.com', 'ABCD1234');
    expect(login).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Testing authlogout function', () => {
  test('Successful logout (one token)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
    expect(requestAuthLogout(user.token)).toStrictEqual({});
  });

  test('Successful logout (multiple tokens)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
    const login = requestAuthLogin('example@gmail.com', 'ABCD1234');
    expect(requestAuthLogout(user.token)).toStrictEqual({});
    expect(requestAuthLogout(login.token)).toStrictEqual({});
  });

  test('Failed logout (invalid token)', () => {
    requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
    expect(requestAuthLogout('wrongToken')).toStrictEqual({ error: expect.any(String) });
  });

  test(' 1 Successful logout and 1 failed (multiple tokens)', () => {
    const user = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana');
    requestAuthLogin('example@gmail.com', 'ABCD1234');
    expect(requestAuthLogout(user.token)).toStrictEqual({});
    expect(requestAuthLogout('wrongToken')).toStrictEqual({ error: expect.any(String) });
  });
});
