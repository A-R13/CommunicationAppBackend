import { newUser, newChannel, newDm, dmType } from './other';

import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestChannelMessages, requestDmCreate, requestMessageSend, requestDmRemove, requestDmMessages,
  requestDmDetails, requestDmList, requestMessageEdit, requestChannelJoin, requestDmLeave
} from './wrapperFunctions';

requestClear();

describe(('DM Create tests'), () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let user3: newUser;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe') as {token: string, authUserId: number}; // uid = 0
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number}; // uid = 1
    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 2
    user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 3
  });

  test(('Error returns'), () => {
    expect(requestDmCreate(user0.token, [1, 2, 3, 4])).toStrictEqual({ error: expect.any(String) });
    expect(requestDmCreate(user0.token, [1, 1])).toStrictEqual({ error: expect.any(String) });
    expect(requestDmCreate('token1', [1, 2])).toStrictEqual({ error: expect.any(String) });
  });

  test(('Correct returns'), () => {
    expect(requestDmCreate(user0.token, [1, 2])).toStrictEqual({ dmId: expect.any(Number) });

    requestDmCreate(user0.token, [1]);

    const expectedDms2 = { dms: [{ dmId: expect.any(Number), name: expect.any(String) }, { dmId: expect.any(Number), name: expect.any(String) }] };
    const expectedDms1 = { dms: [{ dmId: expect.any(Number), name: expect.any(String) }] };

    expect(requestDmList(user0.token)).toMatchObject(expectedDms2);
    expect(requestDmList(user1.token)).toMatchObject(expectedDms2);
    expect(requestDmList(user2.token)).toMatchObject(expectedDms1);
    expect(requestDmList(user3.token)).toMatchObject({ dms: [] });
  });
});

describe(('Message Send tests'), () => {
  let user0: newUser;
  let user1: newUser;
  let channel0: newChannel;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 0
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 1

    channel0 = requestChannelsCreate(user0.token, 'Channel1', true);
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

describe(('DM remove tests'), () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let user3: newUser;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe') as {token: string, authUserId: number}; // uid = 0
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number}; // uid = 1

    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 2
    user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number}; // uid = 3
  });

  test(('Error returns'), () => {
    requestDmCreate(user0.token, [1, 2, 3]);
    expect(requestDmRemove(user1.token, 0)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove(user0.token, 1)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove('RANDOM TOKEN', 0)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove(user1.token, 0)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove(user2.token, 0)).toStrictEqual({ error: expect.any(String) });
    // Do one for dm leave
  });

  test(('For one dm, owner removes it'), () => {
    requestDmCreate(user0.token, [1, 2, 3]);
    expect(requestDmRemove(user0.token, 0)).toStrictEqual({});
  });

  test(('For multiple dm, owner removes it'), () => {
    requestDmCreate(user0.token, [1, 2, 3]);
    requestDmCreate(user1.token, [0, 2, 3]);
    requestDmCreate(user3.token, [1]);
    expect(requestDmRemove(user1.token, 1)).toStrictEqual({});
  });
});

describe('Dm Messages tests', () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let dm0: newDm;
  let dm1: newDm;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 0
    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid = 1
    user2 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 2

    dm0 = requestDmCreate(user0.token, [1]);
    dm1 = requestDmCreate(user0.token, [1, 2]);
  });

  test('Error Returns', () => {
    // dmId does not refer to an existing Dm
    expect(requestDmMessages(user0.token, 69, 0)).toStrictEqual({ error: expect.any(String) });

    // start is greater than no of messages in channel
    expect(requestDmMessages(user0.token, dm0.dmId, 50)).toStrictEqual({ error: expect.any(String) });

    // dmId is valid but user is not member of that channel
    expect(requestDmMessages(user2.token, dm0.dmId, 0)).toStrictEqual({ error: expect.any(String) });

    // authuserid is invalid
    expect(requestDmMessages('abc', dm1.dmId, 0)).toStrictEqual({ error: expect.any(String) });
  });

  test('Correct Return', () => {
    // start is 0, should return empty messages array.
    expect(requestDmMessages(user1.token, dm1.dmId, 0)).toStrictEqual({ messages: [], start: 0, end: -1 });

    // Add more tests when dm message send is done.
  });
});

describe('Dm details tests', () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let dm0: dmType;

  const memberCheck = [
    {
      email: 'example1@gmail.com',
      handleStr: 'johndoe',
      nameFirst: 'John',
      nameLast: 'Doe',
      uId: 0,
    },
    {
      email: 'example2@gmail.com',
      handleStr: 'bobdoe',
      nameFirst: 'Bob',
      nameLast: 'Doe',
      uId: 1,
    }
  ];

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 0
    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid = 1
    user2 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 2
    dm0 = requestDmCreate(user0.token, [user1.authUserId]);
  });

  test('Error (Invalid token)', () => {
    expect(requestDmDetails('invalid Token', dm0.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Error (Invalid dmId)', () => {
    expect(requestDmDetails(user0.token, 67)).toStrictEqual({ error: expect.any(String) });
  });

  test('Error (user is not member of DM)', () => {
    expect(requestDmDetails(user2.token, dm0.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Successful return', () => {
    expect(requestDmDetails(user1.token, dm0.dmId)).toStrictEqual({ name: 'bobdoe, johndoe', members: memberCheck });
  });
});

describe('Dm List Tests', () => {
  let user0: newUser;

  let user1: newUser;

  let user2: newUser;

  let dm0: dmType;

  beforeEach(() => {
    requestClear();

    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 0

    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid = 1

    user2 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 2

    dm0 = requestDmCreate(user0.token, [user1.authUserId]);
  });

  test('Error Returns', () => {
    // user doesnt exist

    expect(requestDmList('abc')).toStrictEqual({ error: expect.any(String) });
  });

  test('Correct Returns', () => {
    expect(requestDmList(user0.token)).toStrictEqual({ dms: [{ dmId: dm0.dmId, name: 'bobdoe, johndoe' }] });

    expect(requestDmList(user1.token)).toStrictEqual({ dms: [{ dmId: dm0.dmId, name: 'bobdoe, johndoe' }] });

    const dm1 = requestDmCreate(user0.token, [user1.authUserId, user2.authUserId]);

    const user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Steve', 'Doe') as {token: string, authUserId: number}; // uid = 3

    const dm2 = requestDmCreate(user0.token, [user1.authUserId, user2.authUserId, user3.authUserId]);

    expect(requestDmList(user0.token)).toStrictEqual({

      dms: [

        { dmId: dm0.dmId, name: 'bobdoe, johndoe' },

        { dmId: dm1.dmId, name: 'bobdoe, jeffdoe, johndoe' },

        { dmId: dm2.dmId, name: 'bobdoe, jeffdoe, johndoe, stevedoe' },

      ]

    });
  });
});

describe('Message Edit', () => {
  let user0;
  let user1;
  /*
  let user2;

  let dm0;
  let dm1;
  */

  let channel0;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 0
    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid = 1
    /*
    user2 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 2

    dm0 = requestDmCreate(user0.token, [1]);
    dm1 = requestDmCreate(user0.token, [1, 2]);
    */
    channel0 = requestChannelsCreate(user0.token, 'Channel 1', true);
  });

  test(('Error returns'), () => {
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    expect(requestMessageEdit('RANDOMTOKEN ', msg1.messageId, 'Hello')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit(user0.token, 0, 'message')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit(user1.token, msg1.messageId, 'asdjasjdks')).toStrictEqual({ error: expect.any(String) });
  });

  test(('error, no owner perms and change other messages'), () => {
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    requestChannelJoin(user1.token, channel0.channelId);
    expect(requestMessageEdit(user1.token, msg1.messageId, 'Change message when not owner')).toStrictEqual({ error: expect.any(String) });
  });

  test(('Correct returns'), () => {
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    requestMessageEdit(user0.token, msg1.messageId, 'Message change');
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
    requestMessageEdit(user0.token, msg1.messageId, '');
    expect(requestChannelMessages(user0.token, channel0.channelId, 0).messages).toStrictEqual(
      []
    );
  });

  test(('Correct returns, owner edits another persons message'), () => {
    requestChannelJoin(user1.token, channel0.channelId);
    const msg1 = requestMessageSend(user1.token, channel0.channelId, 'Test Message 1');
    requestMessageEdit(user0.token, msg1.messageId, 'OWNER PERMISIONS ARE THE BEST MESSAGE');
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
    const msg2 = requestMessageSend(user0.token, channel0.channelId, 'Random text');
    const msg3 = requestMessageSend(user1.token, channel0.channelId, 'Test Message 3');

    requestMessageEdit(user1.token, msg3.messageId, 'RANDOM MESSAGE BY SECOND USER.');
    expect(requestChannelMessages(user1.token, channel0.channelId, 0).messages).toStrictEqual([
      {
        message: 'RANDOM MESSAGE BY SECOND USER.',
        messageId: msg3.messageId,
        uId: user1.authUserId,
        timeSent: expect.any(Number),
      },
      {
        message: 'Random text',
        messageId: msg2.messageId,
        uId: user0.authUserId,
        timeSent: expect.any(Number),
      }
    ]
    );
  });
  // FOR DMS NOW when message send avaliable
});

describe('dmLeave tests', () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let dm0: newDm;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'Abcd1234', 'Jake', 'Doe')//uid = 0
    user1 = requestAuthRegister('example2@gmail.com', 'Abcd1234', 'John', 'Doe')//uid = 1
    user2 = requestAuthRegister('example3@gmail.com', 'Abcd1234', 'Bob', 'Doe')//uid = 2
    user3 = requestAuthRegister('example4@gmail.com', 'Abcd1234', 'Jeff', 'Doe')//uid = 3
    dm0 = requestDmCreate(user0.token, [1, 2]);

  });

  test('Error returns', () => {
    //invalid dmId
    expect(requestDmLeave(user0.token, '99')).toStrictEqual({ error: expect.any(String) });

    //user is not a member of the DM
    expect(requestDmLeave(user3.token, dm0.dmId))

    //invalid token
    expect(requestDmLeave('RandomToken', dm0.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('remove member', () => {
    expect(requestDmLeave(user1.token, 1)).toStrictEqual({});

  })

  test ('multiple users in DM', () => {
    requestDmLeave(user1.token, dm0.dmId);
    requestDmLeave(user2.token, dm0.dmId);
    expect(requestDmDetails(user0.token, dm0.dmId)).toStrictEqual({

    })

  });

  test('Dm when owner leaves', () => {
    requestDmLeave(user0.token, dm0.dmId);
    expect(requestDmDetails(user1.token, dm0.dmId)).toStrictEqual({

    })
  })


})
