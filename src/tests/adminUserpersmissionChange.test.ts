import { newUser, newChannel, newDm, message } from '../dataStore';
import {
  requestClear, requestAuthRegister, requestChannelsCreate, requestAdminUserRemove, requestChannelJoin, requestUsersAll, requestUserProfile, requestDmCreate,
  requestMessageSend, requestChannelMessages, requestMessageSendDm, requestDmMessages, requestMessagePin, requestchannelDetails, requestDmDetails
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
        dm0 = requestDmCreate(user1.token, [1]);
    });

    test ('error returns', () => {
        requestChannelJoin(user1.token, channel0.channelId);

        // uid is not a valid user
        expect(requestadminUserpermissionChange(user0.token, 0, pm.permissionId, pm.permissionId)).toStrictEqual(400);
        //only global owner
        expect(requestadminUserpermissionChange(user0.token, user0.authUserId, pm.permissionId)).toStrictEqual(400);
        //invalid permissionId
        expect(requestadminUserpermissionChange(user0.token, user1.authUserId, 0)).toStrictEqual(400);
        //user already has same permission level
        requestAdminUserRemove(requestadminUserpermissionChange(user0.token, user1.authUserId, pm.permissionId));
        expect(requestadminUserpermissionChange(user0.token, user1.authUserIdm, pm.permissionId)).toStrictEqual(400);

        //invalid token
        expect(requestadminUserpermissionChange('INVALID TOKEN', user0.authUserId, pm.permissionId)).toStrictEqual(403)
        //not a global owner
        expect(requestadminUserpermissionChange(user1.tokne, user2.authUserId, pm.permissionId)).toStrictEqual(403);
    });



})