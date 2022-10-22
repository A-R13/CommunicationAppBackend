import { requestHelper, requestClear } from './other';
import { requestAuthRegister } from './auth.test';

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}

requestClear();

describe(('DM Create tests'), () => {
  let user0;
  //   let user1;
  //   let user2;
  //   let user3;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe') as {token: string, authUserId: number}; // uid = 0
    // user1 =
    requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number}; // uid = 1
    // user2 =
    requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 2
    // user3 =
    requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 3
  });

  test(('Error returns'), () => {
    expect(requestDmCreate(user0.token, [1, 2, 3, 4])).toStrictEqual({ error: expect.any(String) });
    expect(requestDmCreate(user0.token, [1, 1])).toStrictEqual({ error: expect.any(String) });
    expect(requestDmCreate('token1', [1, 2])).toStrictEqual({ error: expect.any(String) });
  });

  test(('Correct returns'), () => {
    expect(requestDmCreate(user0.token, [1, 2, 3])).toStrictEqual({ dmId: expect.any(Number) });

    // requestDmCreate(user0.token, [0,1]);
    // expect(requestDmDetails(user0.token)) ==> should include only 2 dms
    // expect(requestDmDetails(user1.token)) ==> should include only 2 dms
    // expect(requestDmDetails(user2.token)) ==> should include only 1 dm
    // expect(requestDmDetails(user3.token)) ==> should not include any dms
  });
});
