import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel.js';
import { channelsCreateV1 } from './channels.js';
import { authRegisterV1 } from './auth.js';
import { clearV1, getAuthUserId, getChannel, getUId } from './other.js';
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
        user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe').authUserId;
        channel1 = channelsCreateV1(user1, 'Channel1', true).channelId;

        user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe').authUserId;
        channel2 = channelsCreateV1(user2, 'Channel2', true).channelId;
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
        // start is 0, should return empty messages array.
        expect(channelMessagesV1(user1, channel1, 0)).toStrictEqual( {messages: [], start: 0, end: -1}  );

    })
    
})


describe("Channel details testing", () => {


    test("Testing base case", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
        expect(channelDetailsV1(data.users[0].authUserId, data.channels[0].channelId)).toStrictEqual(
                {
                    name: data.users[0].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[0].ownerMembers,
                    AllMembers: data.channels[0].allMembers,
                } 
                );
    });

    clearV1();

    test("Testing base case v2", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
        channelsCreateV1(data.users[0].authUserId, 'Channel2', true);
        
        expect(channelDetailsV1(data.users[0].authUserId, data.channels[1].channelId)).toStrictEqual(
                {
                    name: data.users[0].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[1].ownerMembers,
                    AllMembers: data.channels[1].allMembers,
                } 
            );
    });

    clearV1();

    test("Testing base case v3", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        authRegisterV1("geoffrey2@email.com", "abcd1234", "Geoff2", "Mok2");
        channelsCreateV1(data.users[1].authUserId, 'Channel1', true);
        channelsCreateV1(data.users[0].authUserId, 'Channel2', true);
        
        expect(channelDetailsV1(data.users[1].authUserId, data.channels[0].channelId)).toStrictEqual(
                {
                    name: data.users[1].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[0].ownerMembers,
                    AllMembers: data.channels[0].allMembers,
                } 
            );
    });

    clearV1();

    test("Channel ID is invalid", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
        channelsCreateV1(data.users[0].authUserId, 'Channel2', true);
        
        expect(channelDetailsV1(data.users[0].authUserId, 3)).toStrictEqual(

            {
                error: "error",
            });
    });


    clearV1();


    test("authuser ID is invalid", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
        channelsCreateV1(data.users[0].authUserId, 'Channel2', true);

        expect(channelDetailsV1(3, 1)).toStrictEqual(
            {
                error: "error",
            });
    });

    clearV1();

    test("Channel ID is valid but authuser is not in the channel", () => {
        const data = getData();
        authRegisterV1("geoffrey@email.com", "abcd1234", "Geoff", "Mok");
        authRegisterV1("brian@email.com", "abcd1234", "Brian", "Mok");
        channelsCreateV1(data.users[0].authUserId, 'Channel1', true);
        channelsCreateV1(data.users[0].authUserId, 'Channel2', true);

        expect(channelDetailsV1(data.users[1].authUserId, data.channels[0].channelId)).toStrictEqual(
            {
                error: "error",
            });
    });
});

describe("channelJoin tests", () => { 
    let user1;
    let user2; 
    let channel1; 
    let channel2;

    beforeEach(() => {
        user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe').authUserId;

        channel1 = channelsCreateV1(user1, 'Channel1', true).channelId;

        user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe').authUserId;
        channel2 = channelsCreateV1(user1, 'Channel2', true).channelId;
    })

    test ('error returns', () => { 
        //invalid channel
        expect(channelJoinV1(user1, 'abcde')).toStrictEqual({ error: expect.any(String)});
        
        //user is already in channel
        expect(channelJoinV1(user1, channel1)).toStrictEqual({ error: expect.any(String)}); 

        //channel is private and user is not already a channel member
        expect(channelJoinV1(user1, channel2)).toStrictEqual({ error: expect.any(String)}); 

        //invalid user 
        expect(channelJoinV1('abcde', channel1)).toStrictEqual({ error: expect.any(String)});
        
    })

    test('Correct Returns', () => {

        let data = getData();

        const user_1 = data.users.find(a => a.authUserId === user1);
        const user_2 = data.users.find(a => a.authUserId === user2);
        const channel = data.channels.find(a => a.channelId === channel2);
        let members = channel.allMembers;

        expect(members).toStrictEqual([
            {
                uId: user_1.authUserId,
                email: user_1.email,
                nameFirst: user_1.nameFirst,
                nameLast: user_1.nameLast,
                handleStr: user_1.user_handle,
            },
          ]);

    })
});

describe('Channel Invite tests', () => {

    test('creator of channel can invite other valid uIds', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true); 
        expect(channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(dennis.authUserId, channel.channelId)).toStrictEqual(
                {
                    name: data.users[dennis.authUserId].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[channel.channelId].ownerMembers,
                    AllMembers: data.channels[channel.channelId].allMembers,
                }
        )
    });

    test('invited valid user can invite other valid users', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const geoffrey = authRegisterV1('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        expect(channelInviteV1(dennis.authUserId, channel.channelId, geoffrey.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(geoffrey.authUserId, channel.channelId)).toStrictEqual(
                {
                    name: data.users[geoffrey.authUserId].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[channel.channelId].ownerMembers,
                    AllMembers: data.channels[channel.channelId].allMembers,
                },
        )
    });

    test('an user invited by an invited user can invite other valid users', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const geoffrey = authRegisterV1('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
        const aditya = authRegisterV1('aditya.rana@gmail.com', 'password4', 'aditya', 'rana');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        channelInviteV1(dennis.authUserId, channel.channelId, geoffrey.authUserId);
        expect(channelInviteV1(geoffrey.authUserId, channel.channelId, aditya.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(aditya.authUserId, channel.channelId)).toStrictEqual(
                {
                    name: data.users[aditya.authUserId].nameFirst,
                    isPublic: true,
                    ownerMembers: data.channels[channel.channelId].ownerMembers,
                    AllMembers: data.channels[channel.channelId].allMembers,
                },
        )
    });

    test('private channels can also let users become members upon invitation', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', false); 
        expect(channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(dennis.authUserId, channel.channelId)).toStrictEqual(
                {
                    name: data.users[dennis.authUserId].nameFirst,
                    isPublic: false,
                    ownerMembers: data.channels[channel.channelId].ownerMembers,
                    AllMembers: data.channels[channel.channelId].allMembers,
                }
        )
    });


    test('throw error when channel is invalid', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        expect(channelInviteV1(nicole.authUserId, 'a', dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        )
    });

    test('throw error when authUser is invalid', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        expect(channelInviteV1('a', channel.channelId, dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        )
    });

    test('throw error when uId is invalid', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        expect(channelInviteV1(nicole.authUserId, channel.channelId, 'a')).toStrictEqual(
            { error: expect.any(String) }
        )
    });

    test('throw error when uId is already a member', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        expect(channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        )
    });

    test('throw error when authUserId is not a member', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const aditya = authRegisterV1('aditya.rana@gmail.com', 'password4', 'aditya', 'rana');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        expect(channelInviteV1(dennis.authUserId, channel.channelId, aditya.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });    

    test('throw error when authUserId is not a member', () => {
        const data = getData();
        const nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        const dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        const aditya = authRegisterV1('aditya.rana@gmail.com', 'password4', 'aditya', 'rana');
        const channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        expect(channelInviteV1(aditya.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });

});

