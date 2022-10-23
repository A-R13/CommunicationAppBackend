import { newUser, newChannel, requestHelper, requestClear } from './other';
import { requestAuthRegister } from './auth.test';
import { requestChannelsCreate } from './channels.test';
import { requestChannelMessages, requestChannelJoin } from './channel.test';

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}

export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message });
}

export function requestMessageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v1', { token, messageId, message });
}

requestClear();

describe(('DM Create tests'), () => {
  let user0: newUser;
  //   let user1: newUser;
  //   let user2: newUser;
  //   let user3: newUser;

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

describe(('Message edit tests'), () => {
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
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
  expect(requestMessageEdit("RANDOMTOKEN ", msg1.messageId, "Hello")).toStrictEqual({ error: expect.any(String) } );
  expect(requestMessageEdit(user0.token, 0, "message")).toStrictEqual({error: expect.any(String)});
  expect(requestMessageEdit(user1.token, msg1.messageId, "asdjasjdks")).toStrictEqual({error: expect.any(String)});

  });
  
  test(('Correct returns'), () => {
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    requestMessageEdit(user0.token, msg1.messageId, "Message change");
    expect(requestChannelMessages(user0.token, channel0.channelId, 0).messages).toContainEqual(
      {
        message: 'Message change',
        messageId: msg1.messageId,
        uId: user0.authUserId,
        timeSent: expect.any(Number),
      }
    );
    });

  test(('Correct returns, deletes if message is nothing'), () => {
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    requestMessageEdit(user0.token, msg1.messageId, "");
    expect(requestChannelMessages(user0.token, channel0.channelId, 0).messages).toStrictEqual(
      []
    );
    });

  test(('Correct returns, owner edits another persons message'), () => {
    requestChannelJoin(user1.token, channel0.channelId);
    const msg1 = requestMessageSend(user1.token, channel0.channelId, 'Test Message 1');
    requestMessageEdit(user0.token, msg1.messageId, "OWNER PERMISIONS ARE THE BEST MESSAGE");
    expect(requestChannelMessages(user0.token, channel0.channelId, 0).messages).toContainEqual(
      {
        message: 'OWNER PERMISIONS ARE THE BEST MESSAGE',
        messageId: msg1.messageId,
        uId: user1.authUserId, // SHOUlD THIS BE THE PERSON WHO EDITED OR THE PERSON WHO SENT IT INITIALLY
        timeSent: expect.any(Number),
      }
    );
    });


  test(('Correct returns, Multiple messages'), () => {
    requestChannelJoin(user1.token, channel0.channelId);
    const msg1 = requestMessageSend(user1.token, channel0.channelId, 'Test Message 1');
    const msg2 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 2');
    const msg3 = requestMessageSend(user1.token, channel0.channelId, 'Test Message 3');
    const msg4 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 4');
    requestMessageEdit(user1.token, msg3.messageId, "RANDOM MESSAGE BY SECOND USER.");
    expect(requestChannelMessages(user0.token, channel0.channelId, 3).messages).toContainEqual(
      {
        message: 'RANDOM MESSAGE BY SECOND USER.',
        messageId: msg3.messageId,
        uId: user1.authUserId,
        timeSent: expect.any(Number),
      }
    );
    });



});