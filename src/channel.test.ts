import request from 'sync-request';
import config from './config.json';


import { getAuthUserId, getChannel, getUId, requestHelper, requestClear } from './other';
import { requestAuthRegister } from './auth.test';
import { requestChannelsCreate } from './channels.test'



export function requestchannelDetails( token : string, channelId : number) {
    return requestHelper('GET', '/channel/details/v2', { token, channelId });
}

export function requestChannelMessages(token : string, channelId : number, start: number) {
    return requestHelper('GET', '/channel/messages/v2', { token, channelId, start });
}

requestClear();

afterEach(() => {
    requestClear();
})

describe('Channel Messages tests', () => {

    let user1;
    let user2;
    let channel1;
    let channel2;

    beforeEach(() => {
        requestClear();
        user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'John', 'Doe') as {token: string, authUserId: number};
        channel1 = requestChannelsCreate(user1.token, 'Channel1', true) as { channelId: number };

        user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe') as {token: string, authUserId: number};
        channel2 = requestChannelsCreate(user2.token, 'Channel2', true) as { channelId: number };
    })


    test('Error Returns', () => {

        // channelid does not refer to an existing channel
        expect(requestChannelMessages(user1.token, 69, 0)).toStrictEqual({ error: expect.any(String) });

        // start is greater than no of messages in channel
        expect(requestChannelMessages(user1.token, channel1.channelId, 50)).toStrictEqual({ error: expect.any(String) });

        // channelid is valid but user is not member of that channel
        expect(requestChannelMessages(user1.token, channel2.channelId, 0)).toStrictEqual({ error: expect.any(String) });

        // authuserid is invalid
        expect(requestChannelMessages('abc', channel1.channelId, 0)).toStrictEqual({ error: expect.any(String) });

    })

    test('Correct Return', () => {
        // start is 0, should return empty messages array.
        expect(requestChannelMessages(user1.token, channel1.channelId, 0)).toStrictEqual( {messages: [], start: 0, end: -1}  );

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
        requestClear();

        user1 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'nicole', 'Doe');
        channel1 = requestChannelsCreate(user1.token, 'Channel1', true);

        user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'Bob', 'Doe');
        channel2 = requestChannelsCreate(user2.token, 'Channel2', true);

        channel3 = requestChannelsCreate(user1.token, 'Channel3', true);

        user3 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Bob', 'Doe');

    })

    test("Error testing", () => {

        // Channel ID is invalid
        expect(requestchannelDetails(user1.token, 4)).toStrictEqual({ error: "error", });
        
        // authUserID is invalid
        expect(requestchannelDetails("Randomtoken", channel1.channelId)).toStrictEqual({ error: "error", });

        // Channel ID is valid but authUserID is not in the channel
        expect(requestchannelDetails(user1.token, channel2.channelId)).toStrictEqual({ error: "error", });
    });


    test("Testing base case", () => {

        expect(requestchannelDetails(user1.token, channel1.channelId)).toStrictEqual(
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

        expect(requestchannelDetails(user1.token, channel3.channelId)).toStrictEqual(
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

        expect(requestchannelDetails(user2.token, channel2.channelId)).toStrictEqual(
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

    /*
    test("Testing for duplicate names", () => {
        channelJoinV2(user3.token, channel2.channelId);
        expect(requestchannelDetails(user3.token, channel2.channelId)).toStrictEqual(
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
    */

});

/*
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

*/