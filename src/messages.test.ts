import { newUser, newChannel, newDm, dmType } from './other';

import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestChannelMessages, requestDmCreate, requestMessageSend, requestDmRemove, requestDmMessages,
  requestDmDetails, requestDmList, requestMessageEdit, requestChannelJoin, requestMessageSendDm, requestDmLeave, requestMessageRemove
} from './wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
});

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
    expect(requestDmCreate(user0.token, [user1.authUserId, user2.authUserId, user3.authUserId, 4])).toStrictEqual(400);
    expect(requestDmCreate(user0.token, [user1.authUserId, user1.authUserId])).toStrictEqual(400);
    expect(requestDmCreate('token1', [user1.authUserId, user2.authUserId])).toStrictEqual(403);
  });

  test(('Correct returns'), () => {
    expect(requestDmCreate(user0.token, [user1.authUserId, user2.authUserId])).toStrictEqual({ dmId: expect.any(Number) });

    requestDmCreate(user0.token, [user1.authUserId]);

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
    expect(requestMessageSend(user0.token, 500, 'Test Message')).toStrictEqual(400);
    expect(requestMessageSend(user0.token, 0, '')).toStrictEqual(400);

    /*eslint-disable */     // Lint returns "error  Multiline support is limited to browsers supporting ES5 only"
    const bigMessage: string = 'gsDYqv5lnOVTHwiqmzVRWqc6Acxu4t9JAyFW8aVKfGRS4urnbM2xy70bfznynOxgCUVdwqckCtMOq31IoiV\
    IZznF3m7lU5bGXdPoJrukmxajudHvSdVwpn1uL1vQBZXUe1yB56aLVKfVA1PzQPU1BNAzCrePCAAPHSE6lXCENn5yISjabwFbXi0A84hCfJqFAJ\
    wSZCD74oWhtdykrfqLT3qQhPil8s7WUslBErHLaYyzFcuWyAIHxXPTHDYA9hK24F1Fez6r7tx2Nw5n5jZb6tOqOJIWMUPVV6280uZqYeomn07Rp\
    9koabGH1dqLFpj6Xlh5if9Grmy3q78BUvnffRtzsz9ifJt8CW0DQWFpwuW4uU514FNPF0kmSMVWpJSGV5BCt0uCgf4mIowtGlEV8Joe8WjjTaDG\
    Lo9ssUI0zLaeiTaU5iIMWc1ky1ihtylnhy6XJYzHdmRdib0EVTBSGmjvZYHa85iSYzO5oD0lPCzwkz8hjURz51omlmPhGoWtgsJAebVag11FAAz\
    yTH0hX0VjPygBd2WNV4fnMz1BxwFb58vo6E1OXjQbabo1HA4sbfbZpHyzMtJUowdaelZLE0SUVHZigKMA8CaYT4vuvP5BakTdytYq3L2RhzyerP\
    SpZRYxcsRLo78IhDVzzm7SVVwZ1kUOcS5vyGnB1NtCylieNSGqWCN1YBtXmSNOoH8JS2eaYy4PYgGivOGrL05hQxrmPaWrnKT8tP0b1wHZGABAK\
    x1H6z0ldvBtluEdxMVMQ2jzOEPtcoFRDhWQrc9cn4IepW1tfxPlbv5dyK8ZUlPDlBzEUnxgagwEGoQA9SmVSeY0wXzrkoxxzkO7PwNfqHCiz7be\
    5LuopMDND8mwakQqa6oSvMd8JlCdECf67t3pIIQ0eGYYtYH4WzEGtv6l6US1yuY9GBuDO0mWgjCZO3Z9SNyByNY8mvCBsTKj1ntaHNoz4cJN7nh\
    ZtKu5Kd7iJ3LVOuYGNN71QVjaxnE4Q';
    /* eslint-enable */

    expect(requestMessageSend(user0.token, 0, bigMessage)).toStrictEqual(400);
    expect(requestMessageSend('Random user token', 0, 'Test Message')).toStrictEqual(403);
    expect(requestMessageSend(user1.token, 0, 'Test Message')).toStrictEqual(403);
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
    requestDmCreate(user0.token, [user1.authUserId, user2.authUserId, user3.authUserId]);
    expect(requestDmRemove(user1.token, 0)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove(user0.token, 1)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove('RANDOM TOKEN', 0)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove(user1.token, 0)).toStrictEqual({ error: expect.any(String) });
    expect(requestDmRemove(user2.token, 0)).toStrictEqual({ error: expect.any(String) });
    // Do one for dm leave
  });

  test(('For one dm, owner removes it'), () => {
    const dm0: newDm = requestDmCreate(user0.token, [user1.authUserId, user2.authUserId, user3.authUserId]);
    expect(requestDmRemove(user0.token, dm0.dmId)).toStrictEqual({});
  });

  test(('For multiple dm, owner removes it'), () => {
    requestDmCreate(user0.token, [user1.authUserId, user2.authUserId, user3.authUserId]);
    const dm1: newDm = requestDmCreate(user1.token, [user0.authUserId, user2.authUserId, user3.authUserId]);
    requestDmCreate(user3.token, [user1.authUserId]);
    expect(requestDmRemove(user1.token, dm1.dmId)).toStrictEqual({});
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

    dm0 = requestDmCreate(user0.token, [user1.authUserId]);
    dm1 = requestDmCreate(user0.token, [user1.authUserId, user2.authUserId]);
  });

  test('Error Returns', () => {
    // dmId does not refer to an existing Dm
    expect(requestDmMessages(user0.token, 69, 0)).toStrictEqual(400);

    // start is greater than no of messages in channel
    expect(requestDmMessages(user0.token, dm0.dmId, 50)).toStrictEqual(400);

    // dmId is valid but user is not member of that channel
    expect(requestDmMessages(user2.token, dm0.dmId, 0)).toStrictEqual(403);

    // authuserid is invalid
    expect(requestDmMessages('abc', dm1.dmId, 0)).toStrictEqual(403);
  });

  test('Correct Return', () => {
    // start is 0, should return empty messages array.
    expect(requestDmMessages(user1.token, dm1.dmId, 0)).toStrictEqual({ messages: [], start: 0, end: -1 });
  });

  test('Correct Return with 2 messages', () => {
    requestMessageSendDm(user0.token, dm0.dmId, 'Message 0');
    requestMessageSendDm(user0.token, dm0.dmId, 'Message 1');

    // start is 0, messages array should have 2 entires.
    expect(requestDmMessages(user0.token, dm0.dmId, 0)).toStrictEqual({
      start: 0,
      end: -1,
      messages: [
        {
          messageId: expect.any(Number),
          uId: user0.authUserId,
          message: 'Message 1',
          timeSent: expect.any(Number),
        },
        {
          messageId: expect.any(Number),
          uId: user0.authUserId,
          message: 'Message 0',
          timeSent: expect.any(Number),
        }
      ]
    });
  });

  test('Correct Return with 54 messages', () => {
    for (let i = 0; i < 54; i++) {
      requestMessageSendDm(user0.token, dm0.dmId, `Message ${i}`);
    }

    expect(requestDmMessages(user0.token, dm0.dmId, 3).start).toStrictEqual(3);
    expect(requestDmMessages(user0.token, dm0.dmId, 3).end).toStrictEqual(53);

    expect(requestDmMessages(user0.token, dm0.dmId, 3).messages).toContainEqual({
      messageId: expect.any(Number),
      uId: user0.authUserId,
      message: 'Message 5',
      timeSent: expect.any(Number),
    });

    expect(requestDmMessages(user0.token, dm0.dmId, 2).messages).toContainEqual({
      messageId: expect.any(Number),
      uId: user0.authUserId,
      message: 'Message 52',
      timeSent: expect.any(Number),
    });

    expect(requestDmMessages(user0.token, dm0.dmId, 2).messages).not.toContain({
      messageId: expect.any(Number),
      uId: user0.authUserId,
      message: 'Message 1',
      timeSent: expect.any(Number),
    });
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
    expect(requestDmList('abc')).toStrictEqual(403);
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
  let user0: newUser;
  let user1: newUser;
  let channel0: newChannel;
  let dm0: dmType;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 0
    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid = 1
    dm0 = requestDmCreate(user0.token, [user1.authUserId]);
    channel0 = requestChannelsCreate(user0.token, 'Channel 1', true);
  });

  test(('Error returns'), () => {
    const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Test Message 1');
    const msg2 = requestMessageSendDm(user0.token, dm0.dmId, 'Sending Dm');
    expect(requestMessageEdit('RANDOMTOKEN ', msg1.messageId, 'NOT THE CORRECT TOKEN')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit(user0.token, 0, 'NOT THE CORRECT MESSAGE ID')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit(user1.token, msg1.messageId, 'NOT THE CORRECT USER')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit('RANDOMTOKEN ', msg2.messageId, 'NOT THE CORRECT TOKEN')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit(user0.token, 0, 'NOT THE CORRCET MESSAGE ID')).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageEdit(user1.token, msg2.messageId, ' NOT THE CORRECT USER')).toStrictEqual({ error: expect.any(String) });
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
        uId: user1.authUserId,
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

  test(('Correct returns, for dms'), () => {
    const msg2 = requestMessageSendDm(user0.token, 0, 'Random text');
    const msg3 = requestMessageSendDm(user1.token, 0, 'Test Message 3');

    requestMessageEdit(user1.token, msg3.messageId, 'RANDOM MESSAGE BY SECOND USER.');
    expect(requestDmMessages(user0.token, dm0.dmId, 0)).toStrictEqual({
      messages: [
        {
          message: 'RANDOM MESSAGE BY SECOND USER.',
          messageId: msg3.messageId,
          timeSent: expect.any(Number),
          uId: 1,
        },
        {
          message: 'Random text',
          messageId: msg2.messageId,
          timeSent: expect.any(Number),
          uId: 0,
        }
      ],
      start: 0,
      end: -1
    });
  });
});

describe('Message Send Dm Tests', () => {
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

  test(('Error returns (Invalid Message Length)'), () => {
    expect(requestMessageSendDm(user0.token, dm0.dmId, '')).toStrictEqual({ error: expect.any(String) });
  });

  test(('Error returns (Invalid user token)'), () => {
    expect(requestMessageSendDm('Invalid Token', dm0.dmId, 'Test Message')).toStrictEqual({ error: expect.any(String) });
  });

  test(('Error returns (Invalid DmId)'), () => {
    expect(requestMessageSendDm(user0.token, 1888, 'Test Message')).toStrictEqual({ error: expect.any(String) });
  });

  test(('Error returns (token refers to user that is not a member of Dm)'), () => {
    expect(requestMessageSendDm(user2.token, dm0.dmId, 'Test Message')).toStrictEqual({ error: expect.any(String) });
  });

  test(('Succesful return'), () => {
    expect(requestMessageSendDm(user0.token, dm0.dmId, 'Test Message')).toStrictEqual({ messageId: expect.any(Number) });
  });

  test(('Succesful return unique Id'), () => {
    const message = requestMessageSendDm(user0.token, dm0.dmId, 'Test Message');
    const message2 = requestMessageSendDm(user0.token, dm0.dmId, 'Test Message 2');
    expect(message).toStrictEqual({ messageId: expect.any(Number) });
    expect(message2).toStrictEqual({ messageId: expect.any(Number) });
    expect(message).not.toBe(message2);
  });
});

describe('dmLeave tests', () => {
  let user0: newUser;
  let user1: newUser;
  let user2: newUser;
  let user3: newUser;
  let dm0: newDm;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'Abcd1234', 'Jake', 'Doe'); // uid = 0
    user1 = requestAuthRegister('example2@gmail.com', 'Abcd1234', 'John', 'Doe'); // uid = 1
    user2 = requestAuthRegister('example3@gmail.com', 'Abcd1234', 'Bob', 'Doe'); // uid = 2
    user3 = requestAuthRegister('example4@gmail.com', 'Abcd1234', 'Jeff', 'Doe'); // uid = 3
    dm0 = requestDmCreate(user0.token, [user1.authUserId, user2.authUserId]);
  });

  test('Error returns', () => {
    // invalid dmId
    expect(requestDmLeave(user0.token, 99)).toStrictEqual(400);
    // user is not a member of the DM
    expect(requestDmLeave(user3.token, dm0.dmId)).toStrictEqual(403)
    // invalid token
    expect(requestDmLeave('RandomToken', dm0.dmId)).toStrictEqual(403)
  });

  test('remove member', () => {
    expect(requestDmLeave(user1.token, dm0.dmId)).toStrictEqual({});
  });

  test('multiple users leave DM', () => {
    requestDmLeave(user1.token, dm0.dmId);
    requestDmLeave(user2.token, dm0.dmId);
    expect(requestDmDetails(user0.token, dm0.dmId)).toStrictEqual(
      {
        members: [{
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'Jake',
          nameLast: 'Doe',
          handleStr: 'jakedoe',
        }],
        name: 'bobdoe, jakedoe, johndoe',
      }
    );
  });

  test('Dm when owner leaves', () => {
    requestDmLeave(user0.token, dm0.dmId);
    expect(requestDmDetails(user1.token, dm0.dmId)).toStrictEqual(
      {
        members: [
          {
            uId: 1,
            email: 'example2@gmail.com',
            nameFirst: 'John',
            nameLast: 'Doe',
            handleStr: 'johndoe',
          },
          {
            uId: 2,
            email: 'example3@gmail.com',
            nameFirst: 'Bob',
            nameLast: 'Doe',
            handleStr: 'bobdoe',
          }],
        name: 'bobdoe, jakedoe, johndoe',
      }
    );
  });

  test('if user is not in dm anymore', () => {
    requestDmLeave(user0.token, dm0.dmId);
    expect(requestDmDetails(user0.token, dm0.dmId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });
});

describe('message remove tests', () => {
  let user0: newUser;
  let user1: newUser;
  let channel1: newChannel;
  let dm0: dmType;

  beforeEach(() => {
    requestClear();
    user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');// uid: 0
    user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');// uid: 1

    channel1 = requestChannelsCreate(user0.token, 'Channel1', true);

    dm0 = requestDmCreate(user0.token, [user1.authUserId]);
  });

  test('Error returns', () => {
    const msg1 = requestMessageSend(user0.token, channel1.channelId, 'Message One');
    // invalid token
    expect(requestMessageRemove('INVALIDTOKEN', msg1.messageId)).toStrictEqual(403);
    // invalid messageId
    expect(requestMessageRemove(user0.token, 99)).toStrictEqual(400);
    // if user is not the original sender of the message
    expect(requestMessageRemove(user1.token, msg1.messageId)).toStrictEqual(403);
  });

  test('User with no owner permissions', () => {
    const msg1 = requestMessageSend(user0.token, channel1.channelId, 'Message One');
    requestChannelJoin(user1.token, channel1.channelId);
    expect(requestMessageRemove(user1.token, msg1.messageId)).toStrictEqual(403);
  });

  test('Correct returns', () => {
    const msg1 = requestMessageSend(user0.token, channel1.channelId, 'Message One');
    expect(requestMessageRemove(user0.token, msg1.messageId)).toStrictEqual({});
    expect(requestChannelMessages(user0.token, channel1.channelId, 0).messages).toStrictEqual([]);
  });

  test('Owner removes users message', () => {
    requestChannelJoin(user1.token, channel1.channelId);
    const msg1 = requestMessageSend(user1.token, channel1.channelId, 'I am not an owner');
    expect(requestMessageRemove(user0.token, msg1.messageId)).toStrictEqual({});
    expect(requestChannelMessages(user1.token, channel1.channelId, 0).messages).toStrictEqual([]);
  });

  test('Removing multiple messages', () => {
    requestChannelJoin(user1.token, channel1.channelId);
    const msg1 = requestMessageSend(user0.token, channel1.channelId, 'Message One');
    const msg2 = requestMessageSend(user1.token, channel1.channelId, 'Message Two');
    expect(requestMessageRemove(user1.token, msg2.messageId)).toStrictEqual({});
    expect(requestChannelMessages(user1.token, channel1.channelId, 0).messages).toStrictEqual([
      {
        message: 'Message One',
        messageId: msg1.messageId,
        uId: user0.authUserId,
        timeSent: expect.any(Number),
      },
    ]);
  });

  test('owner removes in dm', () => {
    const msg1 = requestMessageSendDm(user1.token, dm0.dmId, 'I am not an owner');
    expect(requestMessageRemove(user0.token, msg1.messageId)).toStrictEqual({});
    expect(requestDmMessages(user1.token, dm0.dmId, 0).messages).toStrictEqual([]);
  });

  test('multiple messages in dms', () => {
    const msg1 = requestMessageSendDm(user0.token, dm0.dmId, 'Message One in DMs');
    const msg2 = requestMessageSendDm(user1.token, dm0.dmId, 'Message two in DMs');
    expect(requestMessageRemove(user1.token, msg2.messageId)).toStrictEqual({});
    expect(requestDmMessages(user0.token, dm0.dmId, 0).messages).toStrictEqual([
      {
        message: 'Message One in DMs',
        messageId: msg1.messageId,
        uId: 0,
        timeSent: expect.any(Number),
      },
    ]);
  });
});
