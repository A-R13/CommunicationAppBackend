import exp from 'constants';
import { newUser, newChannel, dmType } from '../dataStore';

import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestChannelJoin,
  requestDmCreate, requestUserStatsV1, requestMessageSend, requestMessageSendDm
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
  requestClear();
});

describe("User Stats Tests", () => {
    let user0: newUser;
    let user1: newUser;
    let channel0: newChannel;
    let dm0: dmType;

    beforeEach(() => {
        requestClear();
        user0 = requestAuthRegister('example0@gmail.com', 'ABCD1234', 'Jeff', 'Doe'); // uid = 0
        user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe'); // uid = 1

        channel0 = requestChannelsCreate(user0.token, 'Channel1', true);
        dm0 = requestDmCreate(user0.token, [user1.authUserId]);
    });

    test("Errors", () => {
        expect(requestUserStatsV1("Random Token")).toStrictEqual(403);
    })

    test("Correct output", () => {
        requestMessageSend(user0.token, channel0.channelId, 'THE FIRST MESSAGE BY OWNER');
        expect(requestUserStatsV1(user0.token)).toStrictEqual({
            channelsJoined: [1, expect.any(Number)],
            DmsJoined: [1, expect.any(Number)],
            messagesSent: [1, expect.any(Number)]
        });

        expect(requestUserStatsV1(user1.token)).toStrictEqual({
            channelsJoined: [0, expect.any(Number)],
            DmsJoined: [1, expect.any(Number)],
            messagesSent: [0, expect.any(Number)]
        });
    }) 

    test("Correct output for messages in dm", () => {
        requestMessageSendDm(user0.token, dm0.dmId, 'THE FIRST MESSAGE BY OWNER IN DM');
        requestMessageSendDm(user1.token, dm0.dmId, 'THE SECOND MESSAGE BY OWNER IN DM');
        requestMessageSendDm(user0.token, dm0.dmId, 'THE THIRD MESSAGE BY OWNER IN DM');
        expect(requestUserStatsV1(user0.token)).toStrictEqual({
            channelsJoined: [1, expect.any(Number)],
            DmsJoined: [1, expect.any(Number)],
            messagesSent: [2, expect.any(Number)]
        });

        expect(requestUserStatsV1(user1.token)).toStrictEqual({
            channelsJoined: [0, expect.any(Number)],
            DmsJoined: [1, expect.any(Number)],
            messagesSent: [1, expect.any(Number)]
        });
    }) 

    test("Correct output for messages in dm and channel", () => {
        requestMessageSendDm(user0.token, dm0.dmId, 'THE FIRST MESSAGE BY OWNER IN DM');
        requestMessageSendDm(user1.token, dm0.dmId, 'THE SECOND MESSAGE BY OWNER IN DM');
        requestMessageSendDm(user0.token, dm0.dmId, 'THE THIRD MESSAGE BY OWNER IN DM');
        requestMessageSend(user0.token, channel0.channelId, 'THE FIRST MESSAGE BY OWNER IN CHANNEL');
        requestMessageSend(user1.token, channel0.channelId, 'THE SECOND MESSAGE BY OWNER IN CHANNEL');


        expect(requestUserStatsV1(user0.token)).toStrictEqual({
            channelsJoined: [1, expect.any(Number)],
            DmsJoined: [1, expect.any(Number)],
            messagesSent: [3, expect.any(Number)]
        });

        expect(requestUserStatsV1(user1.token)).toStrictEqual({
            channelsJoined: [0, expect.any(Number)],
            DmsJoined: [1, expect.any(Number)],
            messagesSent: [2, expect.any(Number)]
        });
    }) 


})