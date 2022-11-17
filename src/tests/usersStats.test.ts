import { newChannel, newDm, newUser } from "../dataStore";
import { requestAuthRegister, requestClear, requestDmCreate, requestChannelsCreate, requestUsersStats, requestMessageSend, requestMessageRemove, requestDmRemove, requestMessageSendDm} from "../wrapperFunctions";

requestClear();

let user0: newUser;
let user1: newUser;

let channel0: newChannel;
let dm0: newDm;

beforeEach(() => {
    requestClear;

    user0 = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Bob', 'Doe');
    channel0 = requestChannelsCreate(user0.token, 'Channel1', false);
    user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe');

})

afterEach(() => {
    requestClear();
  });
  
describe('Intial Testing', () => {
    test('error returns', () => {

        // invalid user
        expect(requestUsersStats('abcde')).toStrictEqual(403);
    });

    test('Correct Return', () => {
        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
                channelsExist: [
                    {numChannelsExist: 0, timeStamp: expect.any(Number)},
                    {numChannelsExist: 1, timeStamp: expect.any(Number)}
                ], 
                dmsExist: [{numDmsExist: 0, timeStamp: expect.any(Number)}], 
                messagesExist: [{numMessagesExist: 0, timeStamp: expect.any(Number)}], 
                utilizationRate: 0
            }
        })
    })
});

describe('Fruther testing', () => {

    test('Correct Return', () => {
        requestChannelsCreate(user0.token, 'Channel 2', true);

        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
                channelsExist: [
                    {numChannelsExist: 0, timeStamp: expect.any(Number)},
                    {numChannelsExist: 1, timeStamp: expect.any(Number)},
                    {numChannelsExist: 2, timeStamp: expect.any(Number)}
                ], 
                dmsExist: [{numDmsExist: 0, timeStamp: expect.any(Number)}], 
                messagesExist: [{numMessagesExist: 0, timeStamp: expect.any(Number)}], 
                utilizationRate: 0
            }
        })
    });

    test('correct returns with channel and dm creation', () => {
        
        dm0 = requestDmCreate(user0.token, [1]);

        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
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
                    numDmsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExist: 1,
                    timeStamp: expect.any(Number)
                }
                ],
                messagesExist: [{
                    numMessagesExist: 0,
                    timeStamp: expect.any(Number)
                }
                ],
                utilizationRate: 0
            }
        });
    });

    test('correct returns for multiple channels/dms and messages', () => {

        requestChannelsCreate(user1.token, 'Channel1', true);
        requestDmCreate(user0.token, [1]);

        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestMessageSendDm(user0.token, dm0.dmId, 'Message one in dm');

        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
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
                    numDmsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExist: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExist: 2,
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
            utilizationRate: 1
            }
        });
    });

    requestClear();

    test('correct returns for removing dm', () => {
        requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestDmRemove(user0.token, dm0.dmId);

        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
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
                    numDmsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExist: 1,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExist: 0,
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
                utilizationRate: 0.5
            }
        });
    });

    test('correct returns for removing messages', () => {
        const msg1 = requestMessageSend(user0.token, channel0.channelId, 'Message one in channel');
        requestMessageSend(user0.token, channel0.channelId, 'Message two in channel');
        requestMessageRemove(user0.token, msg1.messageId);

        expect(requestUsersStats(user0.token)).toStrictEqual({
            workspaceStats: {
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
                    numDmsExist: 0,
                    timeStamp: expect.any(Number)
                },
                {
                    numDmsExist: 1,
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
                utilizationRate: 1
            }
        });
    });
});