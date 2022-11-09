import { newUser, newChannel } from '../dataStore';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestchannelDetails, requestChannelJoin,
  requestAddOwner, requestRemoveOwner
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
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
