import { newUser, newChannel } from './other';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestchannelDetails, requestChannelMessages, requestChannelJoin,
  requestChannelInvite, requestChannelLeave, requestAddOwner, requestRemoveOwner, requestChannelsList, requestMessageSend
} from './wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
});

describe('Channel Messages tests', () => {
  let user1: newUser;
  let user2: newUser;
  let channel1: newChannel;
  let channel2: newChannel;

  beforeEach(() => {
    requestClear();
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
    channel1 = requestChannelsCreate(user1.token, 'Channel1', true);

    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    channel2 = requestChannelsCreate(user2.token, 'Channel2', true);
  });

  test('Error Returns', () => {
    // channelid does not refer to an existing channel
    expect(requestChannelMessages(user1.token, 69, 0)).toStrictEqual(400);

    // start is greater than no of messages in channel
    expect(requestChannelMessages(user1.token, channel1.channelId, 50)).toStrictEqual(400);

    // channelid is valid but user is not member of that channel
    expect(requestChannelMessages(user1.token, channel2.channelId, 0)).toStrictEqual(403);

    // authuserid is invalid
    expect(requestChannelMessages('abc', channel1.channelId, 0)).toStrictEqual(403);
  });

  test('Correct Return with no messages', () => {
    // start is 0, should return empty messages array.
    expect(requestChannelMessages(user1.token, channel1.channelId, 0)).toStrictEqual({ messages: [], start: 0, end: -1 });
  });

  test('Correct Return with 2 messages', () => {
    requestMessageSend(user2.token, channel2.channelId, 'Message 0');
    requestMessageSend(user2.token, channel2.channelId, 'Message 1');

    // start is 0, messages array should have 2 entires.
    expect(requestChannelMessages(user2.token, channel2.channelId, 0)).toStrictEqual({
      start: 0,
      end: -1,
      messages: [
        {
          messageId: expect.any(Number),
          uId: user2.authUserId,
          message: 'Message 1',
          timeSent: expect.any(Number),
        },
        {
          messageId: expect.any(Number),
          uId: user2.authUserId,
          message: 'Message 0',
          timeSent: expect.any(Number),
        }
      ]
    });
  });

  test('Correct Return with 53 messages', () => {
    for (let i = 0; i < 53; i++) {
      requestMessageSend(user2.token, channel2.channelId, `Message ${i}`);
    }

    expect(requestChannelMessages(user2.token, channel2.channelId, 2).start).toStrictEqual(2);
    expect(requestChannelMessages(user2.token, channel2.channelId, 2).end).toStrictEqual(52);

    expect(requestChannelMessages(user2.token, channel2.channelId, 2).messages).toContainEqual({
      messageId: expect.any(Number),
      uId: user2.authUserId,
      message: 'Message 5',
      timeSent: expect.any(Number),
    });

    expect(requestChannelMessages(user2.token, channel2.channelId, 2).messages).toContainEqual({
      messageId: expect.any(Number),
      uId: user2.authUserId,
      message: 'Message 51',
      timeSent: expect.any(Number),
    });

    expect(requestChannelMessages(user2.token, channel2.channelId, 2).messages).not.toContain({
      messageId: expect.any(Number),
      uId: user2.authUserId,
      message: 'Message 0',
      timeSent: expect.any(Number),
    });
  });
});

describe('Channel details testing', () => {
  let user1: newUser;
  let user2: newUser;
  let user3: newUser;
  let channel1: newChannel;
  let channel2: newChannel;
  let channel3: newChannel;

  beforeEach(() => {
    requestClear();

    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
    channel1 = requestChannelsCreate(user1.token, 'Channel1', true);

    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    channel2 = requestChannelsCreate(user2.token, 'Channel2', true);

    channel3 = requestChannelsCreate(user1.token, 'Channel3', true);

    user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe');
  });

  test('Error testing', () => {
    // Channel ID is invalid
    expect(requestchannelDetails(user1.token, 4)).toStrictEqual(400);

    // authUserID is invalid
    expect(requestchannelDetails('Randomtoken', channel1.channelId)).toStrictEqual(403);

    // Channel ID is valid but authUserID is not in the channel
    expect(requestchannelDetails(user1.token, channel2.channelId)).toStrictEqual(403);
  });

  test('Testing base case', () => {
    expect(requestchannelDetails(user1.token, channel1.channelId)).toStrictEqual(
      {
        name: 'Channel1',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'Doe',
          handleStr: 'nicoledoe'
        }],
        allMembers: [{
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'Doe',
          handleStr: 'nicoledoe'
        }],
      }
    );
  });

  test('Testing base case v2', () => {
    expect(requestchannelDetails(user1.token, channel3.channelId)).toStrictEqual(
      {
        name: 'Channel3',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'Doe',
          handleStr: 'nicoledoe'
        }],
        allMembers: [{
          uId: 0,
          email: 'example1@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'Doe',
          handleStr: 'nicoledoe'
        }],
      }
    );
  });

  test('Testing base case v3', () => {
    expect(requestchannelDetails(user2.token, channel2.channelId)).toStrictEqual(
      {
        name: 'Channel2',
        isPublic: true,
        ownerMembers: [{
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Doe',
          handleStr: 'bobdoe'
        }],
        allMembers: [{
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Doe',
          handleStr: 'bobdoe'
        }],
      }
    );
  });

  test('Testing for duplicate names', () => {
    requestChannelJoin(user3.token, channel2.channelId);
    expect(requestchannelDetails(user3.token, channel2.channelId)).toStrictEqual(
      {
        name: 'Channel2',
        isPublic: true,
        ownerMembers: [{
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Doe',
          handleStr: 'bobdoe'
        }],
        allMembers: [{
          uId: 1,
          email: 'example2@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Doe',
          handleStr: 'bobdoe'
        }, {
          uId: 2,
          email: 'example3@gmail.com',
          nameFirst: 'Bob',
          nameLast: 'Doe',
          handleStr: 'bobdoe0'
        }],
      }
    );
  });
});

describe('channelJoin tests', () => {
  let user1: newUser;
  let user2: newUser;
  let channel1: newChannel;
  let channel2: newChannel;
  let channel3: newChannel;

  let user3: newUser;

  beforeEach(() => {
    requestClear();

    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
    channel1 = requestChannelsCreate(user1.token, 'Channel1', false);

    user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    channel2 = requestChannelsCreate(user2.token, 'Channel2', true);
    channel3 = requestChannelsCreate(user2.token, 'Channel3', false);
  });

  test('error returns', () => {
    // invalid channel
    expect(requestChannelJoin(user1.token, 99)).toStrictEqual(400);

    // user is already in channel
    expect(requestChannelJoin(user1.token, channel1.channelId)).toStrictEqual(400);

    // channel is private and user is not already a channel member or a global owner
    expect(requestChannelJoin(user2.token, channel1.channelId)).toStrictEqual(403);

    // invalid user
    expect(requestChannelJoin('abcde', channel1.channelId)).toStrictEqual(403);
  });

  test('Correct Returns', () => {
    user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Jake', 'Doe');
    // user joining a public channel
    expect(requestChannelsList(user3.token)).toStrictEqual({ channels: [] });

    expect(requestChannelJoin(user3.token, channel2.channelId)).toStrictEqual({});

    expect(requestChannelsList(user3.token)).toStrictEqual({
      channels: [{ channelId: channel2.channelId, name: 'Channel2' }]
    });

    // global owner joining a private channel
    expect(requestChannelsList(user1.token)).toStrictEqual({
      channels: [{ channelId: channel1.channelId, name: 'Channel1' }]
    });

    expect(requestChannelJoin(user1.token, channel3.channelId)).toStrictEqual({});

    expect(requestChannelsList(user1.token)).toStrictEqual({
      channels: [
        { channelId: channel1.channelId, name: 'Channel1' },
        { channelId: channel3.channelId, name: 'Channel3' },
      ]
    });
  });
});

describe('Channel Invite tests', () => {
  let nicole: newUser;
  let dennis: newUser;
  let geoffrey: newUser;
  let channel: newChannel;

  beforeEach(() => {
    requestClear();
    nicole = requestAuthRegister('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
    dennis = requestAuthRegister('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
    geoffrey = requestAuthRegister('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
    channel = requestChannelsCreate(nicole.token, 'funChannelName', true);
  });

  test('creator of channel can invite other valid uIds', () => {
    expect(requestChannelInvite(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual({});
    expect(requestchannelDetails(dennis.token, channel.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }],
        allMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }, {
          uId: 1,
          email: 'dennis.pulickal@gmail.com',
          nameFirst: 'dennis',
          nameLast: 'pulickal',
          handleStr: 'dennispulickal'
        }],
      }
    );
  });

  test('invited valid user can invite other valid users', () => {
    requestChannelInvite(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestChannelInvite(dennis.token, channel.channelId, geoffrey.authUserId)).toStrictEqual({});
    expect(requestchannelDetails(geoffrey.token, channel.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }],

        allMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }, {
          uId: 1,
          email: 'dennis.pulickal@gmail.com',
          nameFirst: 'dennis',
          nameLast: 'pulickal',
          handleStr: 'dennispulickal'
        }, {
          uId: 2,
          email: 'geoffrey.mok@gmail.com',
          nameFirst: 'geoffrey',
          nameLast: 'mok',
          handleStr: 'geoffreymok'
        }],
      }
    );
  });

  test('private channels can also let users become members upon invitation', () => {
    const channelPriv = requestChannelsCreate(nicole.token, 'funChannelName', false);
    expect(requestChannelInvite(nicole.token, channelPriv.channelId, dennis.authUserId)).toStrictEqual({});
    expect(requestchannelDetails(dennis.token, channelPriv.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: false,
        ownerMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }],
        allMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }, {
          uId: 1,
          email: 'dennis.pulickal@gmail.com',
          nameFirst: 'dennis',
          nameLast: 'pulickal',
          handleStr: 'dennispulickal'
        }],
      }
    );
  });

  test('throw error when channel is invalid', () => {
    expect(requestChannelInvite(nicole.token, 5, dennis.authUserId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('throw error when authUser is invalid', () => {
    expect(requestChannelInvite('a', channel.channelId, dennis.authUserId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('throw error when uId is invalid', () => {
    expect(requestChannelInvite(nicole.token, channel.channelId, 70)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('throw error when uId is already a member', () => {
    requestChannelInvite(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestChannelInvite(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('throw error when authUserId is not a member', () => {
    expect(requestChannelInvite(dennis.token, channel.channelId, geoffrey.authUserId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('throw error when authUserId is not a member', () => {
    requestChannelInvite(nicole.token, channel.channelId, dennis.authUserId);
    // in this case, dennis is already a member as well
    expect(requestChannelInvite(geoffrey.token, channel.channelId, dennis.authUserId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('throw error when user tries to invite themself', () => {
    expect(requestChannelInvite(nicole.token, channel.channelId, nicole.authUserId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });
});

describe('removeOwner tests', () => {
  let nicole: newUser;
  let dennis: newUser;
  let geoffrey: newUser;
  let channel: newChannel;

  beforeEach(() => {
    requestClear();
    nicole = requestAuthRegister('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
    dennis = requestAuthRegister('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
    geoffrey = requestAuthRegister('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
    channel = requestChannelsCreate(nicole.token, 'funChannelName', true);
    requestChannelJoin(dennis.token, channel.channelId);
  });

  // success case
  test('successfully removed owner', () => {
    requestAddOwner(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestRemoveOwner(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual({});
    expect(requestchannelDetails(nicole.token, channel.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }],
        allMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }, {
          uId: 1,
          email: 'dennis.pulickal@gmail.com',
          nameFirst: 'dennis',
          nameLast: 'pulickal',
          handleStr: 'dennispulickal'
        }],
      }
    );
  });

  // channelId does not refer to a valid channel
  test('invalid channelId', () => {
    requestAddOwner(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestRemoveOwner(nicole.token, 100000, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // uId does not refer to a valid user
  test('invalid uId', () => {
    requestAddOwner(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestRemoveOwner(nicole.token, channel.channelId, 100000)).toStrictEqual({ error: expect.any(String) });
  });

  // token is invalid
  test('invalid token', () => {
    requestAddOwner(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestRemoveOwner('a', channel.channelId, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // uId refers to a user who is not an owner of the channel
  test('uId is not an owner', () => {
    expect(requestRemoveOwner(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // uId refers to a user who is currently the only owner of the channel
  test('uId is the only owner', () => {
    expect(requestRemoveOwner(nicole.token, channel.channelId, nicole.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // channelId is valid and the authorised user does not have owner permissions in the channel
  test('authorised user does not have owner perms', () => {
    requestChannelJoin(geoffrey.token, channel.channelId);
    requestAddOwner(nicole.token, channel.channelId, dennis.authUserId);
    expect(requestRemoveOwner(geoffrey.token, channel.channelId, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('addOwner tests', () => {
  let nicole: newUser;
  let dennis: newUser;
  let geoffrey: newUser;
  let channel: newChannel;

  beforeEach(() => {
    requestClear();
    nicole = requestAuthRegister('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
    dennis = requestAuthRegister('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
    geoffrey = requestAuthRegister('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
    channel = requestChannelsCreate(nicole.token, 'funChannelName', true);
  });

  // success case
  test('successfully added owner', () => {
    requestChannelJoin(dennis.token, channel.channelId);
    expect(requestAddOwner(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual({});
    expect(requestchannelDetails(nicole.token, channel.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }, {
          uId: 1,
          email: 'dennis.pulickal@gmail.com',
          nameFirst: 'dennis',
          nameLast: 'pulickal',
          handleStr: 'dennispulickal'
        }],
        allMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }, {
          uId: 1,
          email: 'dennis.pulickal@gmail.com',
          nameFirst: 'dennis',
          nameLast: 'pulickal',
          handleStr: 'dennispulickal'
        }],
      }
    );
  });

  // channelId does not refer to a valid channel
  test('throw error if invalid channelId', () => {
    requestChannelJoin(dennis.token, channel.channelId);
    expect(requestAddOwner(nicole.token, 100000, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // uId does not refer to a valid user
  test('throw error if invalid uId', () => {
    requestChannelJoin(dennis.token, channel.channelId);
    expect(requestAddOwner(nicole.token, channel.channelId, 100000)).toStrictEqual({ error: expect.any(String) });
  });

  // uId refers to a user who is not a member of the channel
  test('throw error if uId is not a member of the channel', () => {
    expect(requestAddOwner(nicole.token, channel.channelId, dennis.authUserId));
  });

  // uId refers to a user who is already an owner of the channel
  test('throw error if uId is already an owner', () => {
    requestChannelJoin(dennis.token, channel.channelId);
    expect(requestAddOwner(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual({});
    expect(requestAddOwner(nicole.token, channel.channelId, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // channelId is valid and the authorised user does not have owner permissions
  test('throw error if authorised user is not an owner', () => {
    requestChannelJoin(dennis.token, channel.channelId);
    requestChannelJoin(geoffrey.token, channel.channelId);
    expect(requestAddOwner(geoffrey.token, channel.channelId, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // token is invalid
  test('throw error if token is invalid', () => {
    requestChannelJoin(dennis.token, channel.channelId);
    expect(requestAddOwner('a', channel.channelId, dennis.authUserId)).toStrictEqual({ error: expect.any(String) });
  });

  // authorised user tries to add themselves as an owner
  test('throw error if authorised user adds themself as owner', () => {
    expect(requestAddOwner(nicole.token, channel.channelId, nicole.authUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Channel leave function', () => {
  let nicole: newUser;
  let geoffrey: newUser;
  let channel: newChannel;

  beforeEach(() => {
    requestClear();
    nicole = requestAuthRegister('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
    geoffrey = requestAuthRegister('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
    channel = requestChannelsCreate(nicole.token, 'funChannelName', true);
  });

  test('Errors', () => {
    expect(requestChannelLeave('RANDOMSTRING', channel.channelId)).toStrictEqual({ error: expect.any(String) });
    expect(requestChannelLeave('RANDOMSTRING', 3)).toStrictEqual({ error: expect.any(String) });
    expect(requestChannelLeave(nicole.token, 4)).toStrictEqual({ error: expect.any(String) });
  });

  test('Works for one person in a channel. return error as user not in channel anymore', () => {
    requestChannelLeave(nicole.token, channel.channelId);
    expect(requestchannelDetails(nicole.token, channel.channelId)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('Works for two person in a channel, not a owner', () => {
    requestChannelJoin(geoffrey.token, channel.channelId);
    requestChannelLeave(geoffrey.token, channel.channelId);
    expect(requestchannelDetails(nicole.token, channel.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }],
        allMembers: [{
          uId: 0,
          email: 'nicole.jiang@gmail.com',
          nameFirst: 'nicole',
          nameLast: 'jiang',
          handleStr: 'nicolejiang'
        }],
      }
    );
  });

  test('Works for two person in a channel, Is an owner but removes other', () => {
    requestChannelJoin(geoffrey.token, channel.channelId);
    requestChannelLeave(nicole.token, channel.channelId);
    expect(requestchannelDetails(geoffrey.token, channel.channelId)).toStrictEqual(
      {
        name: 'funChannelName',
        isPublic: true,
        ownerMembers: [],
        allMembers: [{
          uId: 1,
          email: 'geoffrey.mok@gmail.com',
          nameFirst: 'geoffrey',
          nameLast: 'mok',
          handleStr: 'geoffreymok'
        }],
      }
    );
  });
});
