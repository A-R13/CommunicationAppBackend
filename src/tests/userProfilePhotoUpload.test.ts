import { newUser } from '../dataStore';
import { requestClear, requestAuthRegister, requestUserProfile, requestUserProfilePhotoUpload } from '../wrapperFunctions';

requestClear();
let user1: newUser;

beforeEach(() => {
  requestClear();

  user1 = requestAuthRegister('example@gmail.com', 'ABCD1234', 'Bob', 'Doe');
});

afterEach(() => {
  requestClear();
});

describe('Error Testing', () => {
    test('// invalid url/ not correct this one returns a 404', () => {

        expect(() => requestUserProfilePhotoUpload(user1.token, 'http://filesamples.com/samples/image/jpeg/sample_640x426.jpeg', 0, 0, 100, 100)).toThrowError;

    // expect(() => requestUserProfilePhotoUpload(user1.token, 'http://filesamples.com/samples/image/jpeg/sample_640x426.jpeg', 0, 0, 100, 100)).toThrowError;
    });

    test('start/end points are outside the image', () => {
    
        expect(() => requestUserProfilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 0, 0, 3024, 1024)).toThrowError;
    });

    test('start/end points are outside the image', () => {
    
        expect(() => requestUserProfilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', -30, 0, 1024, 1024)).toThrowError;
    });

    test('xEnd is less than xStart', () => {
    
        expect(() => requestUserProfilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 50, 0, 10, 800)).toThrowError;
    });

    test('yEnd is less than yStart', () => {
    
        expect(() => requestUserProfilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 0, 50, 800, 10)).toThrowError;
    });

    test('image is not a .jpg', () => {
       
        expect(() => requestUserProfilePhotoUpload(user1.token, 'http://i.imgur.com/18C0q35.png', 0, 0, 1024, 1024)).toThrowError;
    });
    
    test('invalid user', () => {
       
        expect(() => requestUserProfilePhotoUpload('abcde', 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 0, 0, 1024, 1024)).toThrowError;
    });

});

let user2: newUser;
describe('Succesful Upload', () => {
    test('Example 1', () => {
        expect(requestUserProfile(user1.token, user1.authUserId).user.profileImgUrl).toStrictEqual(null);

        const url = 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg'
        expect(requestUserProfilePhotoUpload(user1.token, url, 1200, 0, 2800, 1867)).toStrictEqual( {} );

        const expectedPath = 'profilePhotos/bobdoe.jpg'
        expect(requestUserProfile(user1.token, user1.authUserId).user.profileImgUrl).toStrictEqual(expectedPath);
    })

    test('Example 2', () => {
        user2 = requestAuthRegister('example2@gmail.com', 'ABCD1234', 'John', 'Doe');

        expect(requestUserProfile(user1.token, user2.authUserId).user.profileImgUrl).toStrictEqual(null);

        const url = 'http://images.unsplash.com/photo-1643270650324-f06418d5081a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
        expect(requestUserProfilePhotoUpload(user2.token, url, 200, 200, 580, 480)).toStrictEqual( {} );

        const expectedPath = 'profilePhotos/johndoe.jpg'
        expect(requestUserProfile(user1.token, user2.authUserId).user.profileImgUrl).toStrictEqual(expectedPath);
    })
})