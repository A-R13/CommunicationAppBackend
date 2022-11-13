import exp from 'constants';
import { newUser, newChannel, dmType, userShort } from '../dataStore';

import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestChannelJoin,
  requestDmCreate, requestUserStatsV1, requestMessageSend, requestMessageSendDm, requestChannelLeave, requestDmRemove, requestDmLeave, requestUsersStats
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
    requestClear();
});

describe('users stats test', () => {
    let user0: newUser;
    let user1: newUser;
    let channel0: newChannel;
    let channel1: newChannel;


    let dm0: dmType;
    let dm1: dmType;



    beforeEach(() => {
        requestClear();
        user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Doe'); // uid: 0
        user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Jake', 'Doe'); // uid: 1

    });

    test('Error returns', () => {
        expect(requestUsersStats('INVALID TOKEN')).toStrictEqual(403);
    });

    test('correct returns - nothing exists', () => {
     //   requestMessageSend(user0.token, channel0.channelId, 'Message One in channel');

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                }],
                dmsExist: [{
                    numDmsExist: 0,
                    timeStamp: expect.any(Number)
                }],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                }],
                utilizationRate: expect.any(Number)
            }
        );
    });

    test('correct returns - one of everything with message in channel', () => {
        channel0 = requestChannelsCreate(user0.token, 'Channel0', true);
        dm0 = requestDmCreate(user0.token, [1]);
        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                dmsExist: [{
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
            utilizationRate: expect.any(Number)

        });
    });

    test('correct returns - one of everything with message in dm', () => {
        channel0 = requestChannelsCreate(user0.token, 'Channel0', true);
        dm0 = requestDmCreate(user0.token, [1]);
        requestMessageSendDm(user0.token, dm0.dmId, 'Message one in dm');

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                dmsExist: [{
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
            utilizationRate: expect.any(Number)

        });
    });

    test('correct returns for multiple channels/dms and messages', () => {
        channel0 = requestChannelsCreate(user0.token, 'Channel0', true);
        channel1 = requestChannelsCreate(user0.token, 'Channel1', true);

        dm0 = requestDmCreate(user0.token, [1]);
        dm1 = requestDmCreate(user0.token, [1]);

        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestMessageSendDm(user0.token, dm0.dmId, 'Message one in dm');

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 2,
                    timeStamp: expect.any(Number)
                }
            ],
                dmsExist: [{
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 2,
                    timeStamp: expect.any(Number)
                }
            ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 2,
                    timeStamp: expect.any(Number)
                }
            ],
            utilizationRate: expect.any(Number)

        });
    });


    test('correct returns for multiple messages', () => {
        channel0 = requestChannelsCreate(user0.token, 'Channel0', true);
        dm0 = requestDmCreate(user0.token, [1]);

        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestMessageSendDm(user0.token, dm0.dmId, 'Message one in dm');
        requestMessageSend(user0.token, channel0.channelId, 'Message two in channel');
        requestMessageSendDm(user0.token, dm0.dmId, 'Message two in dm');

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                dmsExist: [{
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 2,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 3,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 4,
                    timeStamp: expect.any(Number)
                },
            ],
            utilizationRate: expect.any(Number)

        });
    });

    test('correct returns for removing dm', () => {
        channel0 = requestChannelsCreate(user0.token, 'channel0', true);
        dm0 = requestDmCreate(user0.token, [1]);
        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestDmRemove(user0.token, dm0.dmId);

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                dmsExist: [{
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                }
            ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                },
            ],
                utilizationRate: expect.any(Number)
            });
    });

    test('correct returns for removing messages', () => {
        channel0 = requestChannelsCreate(user0.token, 'channel0', true);
        dm0 = requestDmCreate(user0.token, [1]);
        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestMessageSend(user0.token, channel0.channelId, 'Message two in channel');

        expect(requestUsersStats(user0.token)).toStrictEqual(
            {
                channelsExist: [{
                    numChannelsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numChannelsExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                dmsExist: [{
                    numDmsExists: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExists: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 2,
                    timeStamp: expect.any(Number)
                },
                {
                    numMessagesExist: 1,
                    timeStamp: expect.any(Number)
                }
            ],
                utilizationRate: expect.any(Number)
            });
    });
});

