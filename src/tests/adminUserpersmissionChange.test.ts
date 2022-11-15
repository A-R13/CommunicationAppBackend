import { newUser, newChannel, newDm, message } from '../dataStore';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestAdminUserRemove, requestChannelJoin, requestUsersAll, requestUserProfile, requestDmCreate,
  requestMessageSend, requestChannelMessages, requestMessageSendDm, requestDmMessages, requestMessagePin, requestchannelDetails, requestDmDetails, requestAddOwner, requestRemoveOwner,
  requestAdminUserpermissionChange
} from '../wrapperFunctions';

requestClear();

afterEach(() => {
    requestClear();
})

describe('adminpermission change test', () => {
    let user0: newUser;
    let user1: newUser;
    let user2: newUser;

    let channel0: newChannel;
    let dm0: newDm;

    beforeEach(() => {
        requestClear();

        user0 = requestAuthRegister('example1@gmail.com', 'ABCD1234', 'Bob', 'Doe');
        user1 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'John', 'Doe');
        user2 = requestAuthRegister('example3@gmail.com', 'ABCD1234', 'Jeff', 'Doe');

        channel0 = requestChannelsCreate(user0.token, 'channel1', true);
        channel1 = requestChannelsCreate(user1.token, 'channel2', true);
    });

    test ('error returns', () => {
        requestChannelJoin(user1.token, channel0.channelId);

        // uid is not a valid user
        expect(requestAdminUserpermissionChange(user0.token, 0, 1)).toStrictEqual(400);
        //only global owner
        expect(requestAdminUserpermissionChange(user0.token, user0.authUserId, 2)).toStrictEqual(400);
        //invalid permissionId
        expect(requestAdminUserpermissionChange(user0.token, user1.authUserId, 99)).toStrictEqual(400);

        //user already has same permission level
        requestAdminUserpermissionChange(user0.token, user1.authUserId, 1);
        expect(requestAdminUserpermissionChange(user0.token, user1.authUserId, 1)).toStrictEqual(400);

        //invalid token
        expect(requestAdminUserpermissionChange('INVALID TOKEN', user0.authUserId, 1)).toStrictEqual(403)
        //not a global owner
        expect(requestAdminUserpermissionChange(user1.token, user2.authUserId, 1)).toStrictEqual(403);
    });

    //channel owner requesting to demote the only global owner in channel
    test('error return ', () => {
        requestChannelJoin(user0.token, channel1.channelId);
        expect(requestAdminUserpermissionChange(user1.token, user0.authUserId, 2)).toStrictEqual({});

    });

    //removed global owner tries to change permission
    test('error return', () => {
        requestChannelJoin(user0.token, channel1.channelId);
        requestAddOwner(user1.token, channel1.channelId, user2.authUserId);
        requestremoveOwner(user1.token, channel1.channelId, user0.authUserId);
        expect(requestAdminUserpermissionChange(user0.token, user1.authUserId, 2)).toStrictEqual(403);

    });

    test('error return in Dm', () => {
        dm0 = requestDmCreate(user1.token, [0]);
        expect(requestAdminUserpermissionChange(user0.token, user1.authUserId, 2)).toStrictEqual(403);
    })

    test('correct return', () => {
        requestChannelJoin(user1.token, channel0.channelId);
        expect(requestAdminUserpermissionChange(user0.token, user1.authUserId, 1)).toStrictEqual({});

    });

    //global owner changing channel owners permission
    test('correct return', () => {
        requestChannelJoin(user0.token, channel1.channelId);
        expect(requestAdminUserpermissionChange(user0.token, user1.authUserId, 2)).toStrictEqual({});

    });

    //adding new owner who can change permission of other owners
    test('correct return', () => {
        requestChannelJoin(user0.token, channel1.channelId);
        requestChannelJoin(user2.token, channel1.channelId);
        requestAddOwner(user1.token, channel1.channelId, user2.authUserId);
        expect(requestAdminUserpermissionChange(user2.token, user0.authUserId, 2)).toStrictEqual({});

    });

    test('correct return in Dm', () => {
        dm0 = requestDmCreate(user1.token, [0]);
        expect(requestAdminUserpermissionChange(user1.token, user0.authUserId, 1)).toStrictEqual({});
    });
})