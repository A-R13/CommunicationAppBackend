import { newUser, newChannel } from '../dataStore';
import {
    requestClear, requestAuthRegister, requestChannelsCreate, requestChannelJoin, requestStandupStart, requestStandupActive
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
});

describe('standup active tests', () => {
  let user1: newUser;
  let user2: newUser;
  let channel1: newChannel;

  beforeEach(() => {
    requestClear();

    user1 = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    channel1 = requestChannelsCreate(user1.token, 'Channel1', true);

    user2 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
  });

  test('error returns', () => {
    // invalid channel
    expect(requestStandupActive(user1.token, 99)).toStrictEqual(400);

    // user is not in the channel
    expect(requestStandupActive(user2.token, channel1.channelId)).toStrictEqual(403);

    // invalid user
    expect(requestStandupActive('abcde', channel1.channelId)).toStrictEqual(403);
  });

  test('standup is not active', () => {
    requestChannelJoin(user2.token, channel1.channelId);
    expect(requestStandupActive(user2.token, channel1.channelId)).toStrictEqual({ status: false, timeFinish: null });

  })

  test('Correct return', () => {
    requestChannelJoin(user2.token, channel1.channelId);
    requestStandupStart(user1.token, channel1.channelId, 10);
    expect(requestStandupActive(user2.token, channel1.channelId)).toStrictEqual({ status: true, timeFinish: expect.any(Number) });
  });


});












/*
requestClear();

afterEach(() => {
    requestClear();
});

describe('standup active tests', () => {
    let user0: newUser;
    let user1: newUser;
    let channel1: newChannel;


    beforeEach(() => {
        requestClear();

        user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid: 0
        user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Jake', 'Doe'); // uid: 1

        channel1 = requestChannelsCreate(user0.token, 'Channel1', false);
    });

    test('Error returns', () => {
        // Invalid channelId
        expect(requestStandupActive(user0.token, 99)).toStrictEqual(400);
        // Invalid token
        expect(requestStandupActive('INVALID TOKEN', channel1.channelId)).toStrictEqual(403);
        // user not in channel
        expect(requestStandupActive(user1.token, channel1.channelId)).toStrictEqual(403);
    })


    test('correct returns', () => {
        requestChannelJoin(user1.token, channel1.channelId);
        expect(requestStandupActive(user1.token, channel1.channelId)).toStrictEqual(
            {
                status: false,
                timeFinish: null,
            },
        );

        requestStandupStart(user0.token, channel1.channelId, 10);
        expect(requestStandupActive(user1.token, channel1.channelId)).toStrictEqual(
            {
                status: true,
                timeFinish: expect.any(Number),
            },
        );
    });

});
*/