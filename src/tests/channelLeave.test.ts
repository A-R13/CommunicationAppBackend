import { channelleaveV2 } from '../channel';
import { newUser, newChannel } from '../dataStore';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestchannelDetails, requestChannelJoin, requestChannelLeave,
  requestStandupStart
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
});

describe('Channel leave function', () => {
  let nicole: newUser;
  let geoffrey: newUser;
  let channel: newChannel;
  let channel2: newChannel;

  beforeEach(() => {
    requestClear();
    nicole = requestAuthRegister('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
    geoffrey = requestAuthRegister('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
    channel = requestChannelsCreate(nicole.token, 'funChannelName', true);
  });

  test('Errors', () => {
    channel2 = requestChannelsCreate(nicole.token, 'CHANNEL2', true);
    expect(requestChannelLeave('RANDOMSTRING', channel.channelId)).toStrictEqual(403);
    expect(requestChannelLeave('RANDOMSTRING', 3)).toStrictEqual(403);
    expect(requestChannelLeave(nicole.token, 4)).toStrictEqual(400);
    expect(requestChannelLeave(geoffrey.token, channel2.channelId)).toStrictEqual(403);
  });

  test('Works for one person in a channel. return error as user not in channel anymore', () => {
    requestChannelLeave(nicole.token, channel.channelId);
    expect(requestchannelDetails(nicole.token, channel.channelId)).toStrictEqual(403);
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


  test('Correct return, after startup has ended', () => {
    requestStandupStart(nicole.token, channel.channelId, 2);
    const threeSeconds = Math.floor(Date.now() / 1000) + 3;

    /*eslint-disable */ 
    while (Math.floor(Date.now() / 1000) < threeSeconds) {
    }
    /* eslint-enable */

    expect(channelleaveV2(nicole.token, channel.channelId)).toStrictEqual(400)

    expect(requestStandupStart(nicole.token, channel.channelId, 5)).toStrictEqual({ timeFinish: expect.any(Number) });

    /*eslint-disable */ 
    while (Math.floor(Date.now() / 1000) < threeSeconds) {
    }
    /* eslint-enable */
    


  });

});
