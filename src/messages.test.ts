import { requestHelper, requestClear } from './other';
import { requestAuthRegister } from './auth.test';
import { requestChannelMessages } from './channel.test'

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}

export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message });
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


describe(('Message Send tests'), () => {


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
    expect(requestMessageSend(user0.token, 500, 'Test Message')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend(user0.token, 0, '')).toStrictEqual({ error: expect.any(String) });
    // Message with over 1000 characters expect(requestMessageSend(user0.token, 0, '')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend('Random user token', 0, 'Test Message')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend(user1.token, 0, 'Test Message')).toStrictEqual({ error: expect.any(String) });
  });  

  test(('Correct returns'), () => {
    expect(requestMessageSend(user0.token, 0, 'Test Message')).toStrictEqual({ messageId: expect.any(Number) });

    const msg1 = requestMessageSend(user1.token, 1, 'Test Message 1');
    const msg2 = requestMessageSend(user1.token, 1, 'Test Message 2');

    expect(requestChannelMessages(user1.token, 1, 0).messages).toContain(msg1, msg2); // Might need to be edited
  })
})