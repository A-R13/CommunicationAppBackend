import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel.js';
import { channelsCreateV1 } from './channels.js';
import { authRegisterV1 } from './auth.js';
import { clearV1, getAuthUserId, getChannel, getUId } from './other.js';

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

    let user1;
    let user2;
    let user3;
    let channel1;
    let channel2;
    let channel3;


    beforeEach(() => {
        user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe').authUserId;
        channel1 = channelsCreateV1(user1, 'Channel1', true).channelId;

        user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe').authUserId;
        channel2 = channelsCreateV1(user2, 'Channel2', true).channelId;

        channel3 = channelsCreateV1(user1, 'Channel3', true).channelId;

        user3 = authRegisterV1('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe').authUserId;

    })

    test("Error testing", () => {

        // Channel ID is invalid
        expect(channelDetailsV1(user1, 4)).toStrictEqual({ error: "error", });
        
        // authUserID is invalid
        expect(channelDetailsV1(3, user1)).toStrictEqual({ error: "error", });

        // Channel ID is valid but authUserID is not in the channel
        expect(channelDetailsV1(user1, channel2)).toStrictEqual({ error: "error", });
    });


    test("Testing base case", () => {
        expect(channelDetailsV1(user1, channel1)).toStrictEqual(
                {
                    name: 'Channel1',
                    isPublic: true,
                    ownerMembers: [ {
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


    test("Testing base case v2", () => {

        expect(channelDetailsV1(user1, channel3)).toStrictEqual(
                {
                    name: "Channel3",
                    isPublic: true,
                    ownerMembers: [ {
                        uId: 0,
                        email: 'example1@gmail.com',
                        nameFirst: 'nicole',
                        nameLast: 'Doe',
                        handleStr: 'nicoledoe'
                    }],
                    allMembers: [ {
                        uId: 0,
                        email: 'example1@gmail.com',
                        nameFirst: 'nicole',
                        nameLast: 'Doe',
                        handleStr: 'nicoledoe'
                    }],
                }
            );
    });


    test("Testing base case v3", () => {

        expect(channelDetailsV1(user2, channel2)).toStrictEqual(
            {
                name: 'Channel2',
                isPublic: true,
                ownerMembers: [ {
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

    
    test("Testing for duplicate names", () => {
        channelJoinV1(user3, channel2);
        expect(channelDetailsV1(user3, channel2)).toStrictEqual(
            {
                name: 'Channel2',
                isPublic: true,
                ownerMembers: [ {
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
                } ],
            }
            );
    });

});

describe("channelJoin tests", () => {
    let user1;
    let user2;
    let channel1;
    let channel2;
    let channel3;

    let user3;


    beforeEach(() => {
        clearV1();
        user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe').authUserId;
        channel1 = channelsCreateV1(user1, 'Channel1', false).channelId;

        user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe').authUserId;
        channel2 = channelsCreateV1(user2, 'Channel2', true).channelId;
        channel3 = channelsCreateV1(user2, 'Channel3', false).channelId
    })

    test ('error returns', () => {


        //invalid channel
        expect(channelJoinV1(user1, 'abcde')).toStrictEqual({ error: expect.any(String)});

        //user is already in channel
        expect(channelJoinV1(user1, channel1)).toStrictEqual({ error: expect.any(String)});

        //channel is private and user is not already a channel member or a global owner
        expect(channelJoinV1(user2, channel1)).toStrictEqual({ error: expect.any(String)});

        //invalid user
        expect(channelJoinV1('abcde', channel1)).toStrictEqual({ error: expect.any(String)});

    })
    

    test('Correct Returns', () => {
        user3 = authRegisterV1('example3@gmail.com', 'ABCD1234', 'Jake', 'Doe').authUserId

        // user joining a public channel 
        expect(channelJoinV1(user3, channel2)).toStrictEqual({});

        // global owner joining a private channel 
        expect(channelJoinV1(user1, channel3)).toStrictEqual({});

    })
});




describe('Channel Invite tests', () => {

    let nicole;
    let dennis;
    let geoffrey;
    let channel;

    beforeEach(() => {
        nicole = authRegisterV1('nicole.jiang@gmail.com', 'password1', 'nicole', 'jiang');
        dennis = authRegisterV1('dennis.pulickal@gmail.com', 'password2', 'dennis', 'pulickal');
        geoffrey = authRegisterV1('geoffrey.mok@gmail.com', 'password3', 'geoffrey', 'mok');
        channel = channelsCreateV1(nicole.authUserId, 'funChannelName', true);

    })

    test('creator of channel can invite other valid uIds', () => {
        expect(channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(dennis.authUserId, channel.channelId)).toStrictEqual(
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
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        expect(channelInviteV1(dennis.authUserId, channel.channelId, geoffrey.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(geoffrey.authUserId, channel.channelId)).toStrictEqual(
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
        let channelPriv = channelsCreateV1(nicole.authUserId, 'funChannelName', false);
        expect(channelInviteV1(nicole.authUserId, channelPriv.channelId, dennis.authUserId)).toStrictEqual({});
        expect(channelDetailsV1(dennis.authUserId, channelPriv.channelId)).toStrictEqual(
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
        expect(channelInviteV1(nicole.authUserId, 'a', dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });

    test('throw error when authUser is invalid', () => {
        expect(channelInviteV1('a', channel.channelId, dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });

    test('throw error when uId is invalid', () => {
        expect(channelInviteV1(nicole.authUserId, channel.channelId, 'a')).toStrictEqual(
            { error: expect.any(String) }
        );
    });

    test('throw error when uId is already a member', () => {
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        expect(channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });

    test('throw error when authUserId is not a member', () => {
        expect(channelInviteV1(dennis.authUserId, channel.channelId, geoffrey.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });

    test('throw error when authUserId is not a member', () => {
        channelInviteV1(nicole.authUserId, channel.channelId, dennis.authUserId);
        expect(channelInviteV1(geoffrey.authUserId, channel.channelId, dennis.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    });

    test('throw error when user tries to invite themself', () => {
        expect(channelInviteV1(nicole.authUserId, channel.channelId, nicole.authUserId)).toStrictEqual(
            { error: expect.any(String) }
        );
    })

});

