<<<<<<< HEAD
import { requestHelper, requestClear } from './other';
import { requestAuthRegister } from './auth.test';
=======
import { newUser, newChannel, requestHelper, requestClear } from './other';
import { requestAuthRegister } from './auth.test';
import { requestChannelsCreate } from './channels.test';
import { requestChannelMessages } from './channel.test';
>>>>>>> master

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}

<<<<<<< HEAD
requestClear();

describe(('DM Create tests'), () => {
  let user0;
  //   let user1;
  //   let user2;
  //   let user3;
=======
export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message });
}

requestClear();

describe(('DM Create tests'), () => {
  let user0: newUser;
  //   let user1: newUser;
  //   let user2: newUser;
  //   let user3: newUser;
>>>>>>> master

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
<<<<<<< HEAD
=======

describe(('Message Send tests'), () => {
  let user0: newUser;
  let user1: newUser;
  let channel0: newChannel;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe') as {token: string, authUserId: number}; // uid = 0
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number}; // uid = 1

    channel0 = requestChannelsCreate(user0.token, 'Channel1', true) as { channelId: number };
  });

  test(('Error returns'), () => {
    expect(requestMessageSend(user0.token, 500, 'Test Message')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend(user0.token, 0, '')).toStrictEqual({ error: expect.any(String) });
    // Message with over 1000 characters expect(requestMessageSend(user0.token, 0, '')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend('Random user token', 0, 'Test Message')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend(user1.token, 0, 'Test Message')).toStrictEqual({ error: expect.any(String) });
  });

  test(('Correct returns'), () => {
    expect(requestMessageSend(user0.token, channel0.channelId, 'Test Message')).toStrictEqual({ messageId: expect.any(Number) });

    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    requestMessageSend(user0.token, channel0.channelId, 'Test Message 2');
    requestMessageSend(user0.token, channel0.channelId, 'Test Message 3');
    const msgFull = {
      message: 'Test Message 1',
      messageId: msg1.messageId,
      uId: user0.authUserId,
      timeSent: expect.any(Number)
    };

    expect(requestChannelMessages(user0.token, channel0.channelId, 0).messages).toContainEqual(msgFull);
  });
});
>>>>>>> master
