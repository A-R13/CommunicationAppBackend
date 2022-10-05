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

describe('channels list testing', () => { 

    afterEach(() => { 
        clearV1(); 

    })

    test("base case", () => { 
        const user1 = authRegisterV1("athavan@gmail.com", "abcd1234", "Athavan", "Nithiananthan")
        const channel_id = channelsCreateV1(user1.authUserId, "Channel1",  true);

        expect(channelsListV1(user1.authUserId))

    })

    test ('errors', () => { 
        //if authUserId is invalid 
        expect(channelsListV1("abcde")).toStrictEqual({ error: expect.any(String) });
    })

})