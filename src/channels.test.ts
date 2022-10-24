import { requestAuthRegister } from './auth.test';
import { requestchannelDetails } from './channel.test';
import { requestHelper, requestClear, newUser } from './other';

// Type errors in this file are all to do with the channelsListAll tests

export function requestChannelsCreate (token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v2', { token, name, isPublic });
}

export function requestChannelsListAll (token: string) {
  return requestHelper('GET', '/channels/listall/v2', { token });
}

export function requestChannelsList (token: string) {
  return requestHelper('GET', '/channels/list/v2', { token });
}

requestClear();

describe('channelsCreate tests', () => {
  let user: newUser;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
  });

  afterEach(() => {
    requestClear();
  });

  test('Error Returns', () => {
    expect(requestChannelsCreate(user.token, '', true)).toStrictEqual({ error: expect.any(String) });
    expect(requestChannelsCreate(user.token, 'Thisisaverylongchannelname', true)).toStrictEqual({ error: expect.any(String) });
    expect(requestChannelsCreate('abc', 'Channel1', true)).toStrictEqual({ error: expect.any(String) });
  });

  test('Correct Return', () => {
    const channelCreated = requestChannelsCreate(user.token, 'Channel1', true) as { channelId: number };
    expect(channelCreated).toStrictEqual({ channelId: expect.any(Number) });

    expect(requestchannelDetails(user.token, channelCreated.channelId)).toStrictEqual({
      name: 'Channel1',
      isPublic: true,
      ownerMembers: [
        {
          uId: user.authUserId,
          email: 'example1@gmail.com',
          nameFirst: 'John',
          nameLast: 'Doe',
          handleStr: 'johndoe',
        },
      ],
      allMembers: [
        {
          uId: user.authUserId,
          email: 'example1@gmail.com',
          nameFirst: 'John',
          nameLast: 'Doe',
          handleStr: 'johndoe',
        },
      ]
    });
  });
});

describe('ChannelsListAll tests', () => {
  let token: string;
  // User needs to be created in order test this function
  beforeEach(() => {
    requestClear();
    token = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana').token;
  });

  afterEach(() => {
    requestClear();
  });

  test('Testing successful channelsListAll (Private and Public)', () => {
    const channel1 = requestChannelsCreate(token, 'Channel1', true) as { channelId: number };
    const channel2 = requestChannelsCreate(token, 'Channel2', true) as { channelId: number };

    expect(requestChannelsListAll(token)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'Channel1',
        },
        {
          channelId: channel2.channelId,
          name: 'Channel2',
        }
      ]
    });
  });

  test('Testing successful channelsListAll (More Channels))', () => {
    const channel1 = requestChannelsCreate(token, 'Channel1', true) as { channelId: number };
    const channel2 = requestChannelsCreate(token, 'Channel2', false) as { channelId: number };
    const channel3 = requestChannelsCreate(token, 'Channel3', true) as { channelId: number };
    const channel4 = requestChannelsCreate(token, 'Channel4', false) as { channelId: number };

    expect(requestChannelsListAll(token)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'Channel1',
        },
        {
          channelId: channel2.channelId,
          name: 'Channel2',
        },
        {
          channelId: channel3.channelId,
          name: 'Channel3',
        },
        {
          channelId: channel4.channelId,
          name: 'Channel4',
        },
      ]
    });
  });
  test('Testing successful channelsListAll (No channels)', () => {
    expect(requestChannelsListAll(token)).toStrictEqual({
      channels: []
    });
  });

  test('Testing failed channelsListAll (invalid token)', () => {
    requestChannelsCreate(token, 'Channel', false);
    expect(requestChannelsListAll('InvalidToken')).toStrictEqual({ error: expect.any(String) });
  });
});

describe('channelsListV1 tests', () => {
  let user: newUser;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister('example1@gmail.com', 'Abcd1234', 'Luke', 'Smith');
  });

  afterEach(() => {
    requestClear();
  });

  test('Testing error return', () => {
    expect(requestChannelsList('abcd')).toStrictEqual({ error: expect.any(String) });
  });

  test('testing user in multiple channels', () => {
    const channel = requestChannelsCreate(user.token, 'Channel', true) as { channelId: number };
    const channel1 = requestChannelsCreate(user.token, 'Channel1', true) as { channelId: number };
    const channel2 = requestChannelsCreate(user.token, 'Channel2', true) as { channelId: number };

    expect(requestChannelsList(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'Channel',
        },
        {
          channelId: channel1.channelId,
          name: 'Channel1',
        },
        {
          channelId: channel2.channelId,
          name: 'Channel2',
        },
      ]
    });
  });

  test('testing channel owner in channel', () => {
    const channel3 = requestChannelsCreate(user.token, 'Channel3', true) as { channelId: number };
    expect(requestChannelsList(user.token)).toStrictEqual({
      channels: [
        {
          channelId: channel3.channelId,
          name: 'Channel3',
        }
      ]
    });
  });

  test('Testing if no channel is creating', () => {
    expect(requestChannelsList(user.token)).toStrictEqual({
      channels: []
    });
  });
});
