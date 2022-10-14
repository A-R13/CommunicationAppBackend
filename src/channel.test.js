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

    let user1;
    let user2;
    let user3;
    let channel1;
    let channel2;
    let channel3;

    beforeEach(() => {
        user1 = authRegisterV1('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
        channel1 = channelsCreateV1(user1.authUserId, 'Channel1', true);

        user2 = authRegisterV1('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
        channel2 = channelsCreateV1(user2.authUserId, 'Channel2', true);

        channel3 = channelsCreateV1(user1.authUserId, 'Channel3', true);

        user3 = authRegisterV1('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe');

    })


    test("Testing base case", () => {
        expect(channelDetailsV1(user1.authUserId, channel1.channelId)).toStrictEqual(
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

        expect(channelDetailsV1(user1.authUserId, channel3.channelId)).toStrictEqual(
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

        expect(channelDetailsV1(user2.authUserId, channel2.channelId)).toStrictEqual(
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
        channelJoinV1(2, 1);
        expect(channelDetailsV1(2, 1)).toStrictEqual(
            {
                name: 'Channel2',
                isPublic: true,
                ownerMembers: [ {
                    uId: 1,
                    email: 'example2@gmail.com',
                    nameFirst: 'Bob',
                    nameLast: 'Doe',
                    handleStr: 'bobdoe0'
                }, {
                    uId: 2,
                    email: 'example3@gmail.com',
                    nameFirst: 'Bob',
                    nameLast: 'Doe',
                    handleStr: 'bobdoe1'
                }],
                allMembers: [{
                    uId: 1,
                    email: 'example2@gmail.com',
                    nameFirst: 'Bob',
                    nameLast: 'Doe',
                    handleStr: 'bobdoe0'
                }, {
                    uId: 2,
                    email: 'example3@gmail.com',
                    nameFirst: 'Bob',
                    nameLast: 'Doe',
                    handleStr: 'bobdoe1'
                } ],
            }
            );
    });

    test("Channel ID is invalid", () => {

        expect(channelDetailsV1(user1.authUserId, 4)).toStrictEqual(

            {
                error: "error",
            });
    });


    test("authuser ID is invalid", () => {

        expect(channelDetailsV1(3, user1.channelId)).toStrictEqual(
            {
                error: "error",
            });
    });

    test("Channel ID is valid but authuser is not in the channel", () => {

        expect(channelDetailsV1(user1.authUserId, channel2.channelId)).toStrictEqual(
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
        clearV1();
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

