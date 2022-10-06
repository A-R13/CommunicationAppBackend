import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels.js';
import { authRegisterV1 } from './auth.js';
import { clearV1 } from './other.js';
import { getData, setData } from './dataStore.js';

describe('channelsCreate tests', () => {

    let userid;

    beforeEach(() => {
        userid = authRegisterV1('example1@gmail.com', 'ABCD1234', 'John', 'Doe').authUserId;
    })

    afterEach(() => {
        clearV1();
    })

    test('Error Returns', () => {
        expect(channelsCreateV1(userid, '', true)).toStrictEqual({ error: expect.any(String) });
        expect(channelsCreateV1(userid, 'Thisisaverylongchannelname', true)).toStrictEqual({ error: expect.any(String) });
        expect(channelsCreateV1('abc', 'Channel1', true)).toStrictEqual({ error: expect.any(String) });
    })
    
    test('Correct Return', () => {
        const channel_created = channelsCreateV1(userid, 'Channel1', true);

        expect(channel_created).toStrictEqual({ channelId: expect.any(Number) });
    })


})


describe('ChannelsListAll tests', () => {
    const uid;
    // User needs to be created in order test this function
    beforeEach(() =>{
        uid = authRegisterV1('example@gmail.com', 'ABCD1234', 'Aditya', 'Rana').authUserId;
    })

    afterEach(() => {
        clearV1();
    });

    test ('Testing successful channelsListAll (Private and Public)', () => {
        const channel1 = channelsCreateV1(uid, 'Channel1', true);
        const channel2 = channelsCreateV1(uid, 'Channel2', false);

        expect(channelsListAllV1(uid)).toStrictEqual({
            channels: [
                {
                    channelId: channel1.channelId,
                    name: expect.any(String),
                },
                {
                    channelId: channel2.channelId,
                    name: expect.any(String),
                }
            ]
        })
    })

    test ('Testing successful channelsListAll (No channels)', () => {
        expect(channelsListAllV1(uid)).toStrictEqual({
            channels: []
        })

    })

    test ('Testing failed channelsListAll (invalid authUserId)', () => {
        const channel = channelsCreateV1(uid, 'Channel', false);
        expect(channelsListAllV1(uid + 1)).toStrictEqual({error: expect.any(String)});
    })

})