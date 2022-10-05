import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel.js';
import { channelsCreateV1 } from './channels.js';
import { authRegisterV1 } from './auth.js';
import { clearV1 } from './other.js';
import { getData, setData } from './dataStore.js';

afterEach(() => {
    clearV1();
})

describe('Channel Messages tests', () => {

    let user1;
    let user2; 
    let channel1; 
    let channel2;

    beforeEach(() => {
        user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
        channel1 = channelsCreateV1(user1.authUserId, 'Channel1', true);

        user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
        channel2 = channelsCreateV1(user2.authUserId, 'Channel2', true);
    })

    
    test('Error Returns', () => {
    
       
        // channelid does not refer to an existing channel
        expect(channelMessagesV1(user1, 'abc', 0)).toStrictEqual({ error: expect.any(String) });

        // start is greater than no of messages in channel
        expect(channelMessagesV1(user1, channel1, 50)).toStrictEqual({ error: expect.any(String) });

        // channelid is valid but user is not member of that channel 
        expect(channelMessagesV1(user1, channel2, 0)).toStrictEqual({ error: expect.any(String) }); 

        // authuserid is invalid
        expect(channelMessagesV1('abc', channel1, 0)).toStrictEqual({ error: expect.any(String) });
    })


    test('Correct Return', () => {
        
        const data = getData();
        
        const channelid1 = channel1.channelId;
        const channel_1 = data.channels.find(a => a.channelId === channelid1);
        
        const channelid2 = channel2.channelId;
        const channel_2 = data.channels.find(a => a.channelId === channelid2);

        const messages_3 = [{
                messageId: 3,
                uId: user1,
                message: 'Message 3',
                timeSent: 1003,
            },
            {
                messageId: 2,
                uId: user1,
                message: 'Message 2',
                timeSent: 1002,
            },
            {
                messageId: 1,
                uId: user1,
                message: 'Message 1',
                timeSent: 1001,
            },
        ];

        
        channel_1.messages = [];

        channel_1.messages = messages_3;
        
        console.log(channel_1.messages);


        // For the second test, adding over 50 messages.
        const messages_54 = [];
        for (let i = 1; i < 55; i++) {
            const message = {
                messageId: i,
                uId: user2,
                message: `Message ${i}`,
                timeSent: 1000 + i,
            }
            messages_54.unshift(message);
        }
        channel_2.messages = messages_54;

        setData(data);

        expect(channelMessagesV1(user1.authUserId, channelid1, 0)).toStrictEqual( {
            messages: [{
                messageId: 3,
                uId: user1,
                message: 'Message 3',
                timeSent: 1003,
            },
            {
                messageId: 2,
                uId: user1,
                message: 'Message 2',
                timeSent: 1002,
            },
            {
                messageId: 1,
                uId: user1,
                message: 'Message 1',
                timeSent: 1001,
            },
        ],
            start: 0,
            end: -1,
        } );


        // Over 50 msgs
        expect(channelMessagesV1(user2.authUserId, channelid2, 0)).toStrictEqual( {
            messages : [
                { messageId: 54, uId: user2, message: 'Message 54', timeSent: 1054 },
                { messageId: 53, uId: user2, message: 'Message 53', timeSent: 1053 },
                { messageId: 52, uId: user2, message: 'Message 52', timeSent: 1052 },
                { messageId: 51, uId: user2, message: 'Message 51', timeSent: 1051 },
                { messageId: 50, uId: user2, message: 'Message 50', timeSent: 1050 },
                { messageId: 49, uId: user2, message: 'Message 49', timeSent: 1049 },
                { messageId: 48, uId: user2, message: 'Message 48', timeSent: 1048 },
                { messageId: 47, uId: user2, message: 'Message 47', timeSent: 1047 },
                { messageId: 46, uId: user2, message: 'Message 46', timeSent: 1046 },
                { messageId: 45, uId: user2, message: 'Message 45', timeSent: 1045 },
                { messageId: 44, uId: user2, message: 'Message 44', timeSent: 1044 },
                { messageId: 43, uId: user2, message: 'Message 43', timeSent: 1043 },
                { messageId: 42, uId: user2, message: 'Message 42', timeSent: 1042 },
                { messageId: 41, uId: user2, message: 'Message 41', timeSent: 1041 },
                { messageId: 40, uId: user2, message: 'Message 40', timeSent: 1040 },
                { messageId: 39, uId: user2, message: 'Message 39', timeSent: 1039 },
                { messageId: 38, uId: user2, message: 'Message 38', timeSent: 1038 },
                { messageId: 37, uId: user2, message: 'Message 37', timeSent: 1037 },
                { messageId: 36, uId: user2, message: 'Message 36', timeSent: 1036 },
                { messageId: 35, uId: user2, message: 'Message 35', timeSent: 1035 },
                { messageId: 34, uId: user2, message: 'Message 34', timeSent: 1034 },
                { messageId: 33, uId: user2, message: 'Message 33', timeSent: 1033 },
                { messageId: 32, uId: user2, message: 'Message 32', timeSent: 1032 },
                { messageId: 31, uId: user2, message: 'Message 31', timeSent: 1031 },
                { messageId: 30, uId: user2, message: 'Message 30', timeSent: 1030 },
                { messageId: 29, uId: user2, message: 'Message 29', timeSent: 1029 },
                { messageId: 28, uId: user2, message: 'Message 28', timeSent: 1028 },
                { messageId: 27, uId: user2, message: 'Message 27', timeSent: 1027 },
                { messageId: 26, uId: user2, message: 'Message 26', timeSent: 1026 },
                { messageId: 25, uId: user2, message: 'Message 25', timeSent: 1025 },
                { messageId: 24, uId: user2, message: 'Message 24', timeSent: 1024 },
                { messageId: 23, uId: user2, message: 'Message 23', timeSent: 1023 },
                { messageId: 22, uId: user2, message: 'Message 22', timeSent: 1022 },
                { messageId: 21, uId: user2, message: 'Message 21', timeSent: 1021 },
                { messageId: 20, uId: user2, message: 'Message 20', timeSent: 1020 },
                { messageId: 19, uId: user2, message: 'Message 19', timeSent: 1019 },
                { messageId: 18, uId: user2, message: 'Message 18', timeSent: 1018 },
                { messageId: 17, uId: user2, message: 'Message 17', timeSent: 1017 },
                { messageId: 16, uId: user2, message: 'Message 16', timeSent: 1016 },
                { messageId: 15, uId: user2, message: 'Message 15', timeSent: 1015 },
                { messageId: 14, uId: user2, message: 'Message 14', timeSent: 1014 },
                { messageId: 13, uId: user2, message: 'Message 13', timeSent: 1013 },
                { messageId: 12, uId: user2, message: 'Message 12', timeSent: 1012 },
                { messageId: 11, uId: user2, message: 'Message 11', timeSent: 1011 },
                { messageId: 10, uId: user2, message: 'Message 10', timeSent: 1010 },
                { messageId: 9, uId: user2, message: 'Message 9', timeSent: 1009 },
                { messageId: 8, uId: user2, message: 'Message 8', timeSent: 1008 },
                { messageId: 7, uId: user2, message: 'Message 7', timeSent: 1007 },
                { messageId: 6, uId: user2, message: 'Message 6', timeSent: 1006 },
                { messageId: 5, uId: user2, message: 'Message 5', timeSent: 1005 },
            ],
            start: 0,
            end: 50, // start + 50

        });

        expect(channelMessagesV1(user2.authUserId, channelid2, 50)).toStrictEqual( {
            messages : [
                { messageId: 4, uId: user2, message: 'Message 4', timeSent: 1004 },
                { messageId: 3, uId: user2, message: 'Message 3', timeSent: 1003 },
                { messageId: 2, uId: user2, message: 'Message 2', timeSent: 1002 },
                { messageId: 1, uId: user2, message: 'Message 1', timeSent: 1001 }
            ],
            start: 50,
            end: -1,
        } );

    })
})

describe("Channel details testing", () => {

    test("Testing base case", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);

        expect(channelDetailsV1(data.users[0].authUserId, data.channels[0].channelId)).toStrictEqual(
            {
                channel : {
                    name: data.users[0].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[0].ownerMembers,
                    AllMembers: data.channels[0].allMembers,
            } 
          
            });
    });

    clearV1();

    test("Testing base case v2", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
        channelsCreateV1(data.users[0].authUserId, 'Channel2', true);

        expect(channelDetailsV1(data.users[0].authUserId, data.channels[1].channelId)).toStrictEqual(
            {
                channel : {
                    name: data.users[0].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[1].ownerMembers,
                    AllMembers: data.channels[1].allMembers,
            } 
          
            });
    });
});


/*
let user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'John', 'Doe');
let channel1 = channelsCreateV1(user1, 'Channel1', true);

const sample = getData();
        
const messages_3 = [{
        messageId: 3,
        uId: user1,
        message: 'Message 3',
        timeSent: 1003,
    },
    {
        messageId: 2,
        uId: user1,
        message: 'Message 2',
        timeSent: 1002,
    },
    {
        messageId: 1,
        uId: user1,
        message: 'Message 1',
        timeSent: 1001,
    },
];

console.log(sample.channels)

*/