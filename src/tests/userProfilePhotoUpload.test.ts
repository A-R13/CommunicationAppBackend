import { newUser } from '../dataStore';
import { requestClear, requestAuthRegister, requestUserProfile, requestUserProilePhotoUpload } from '../wrapperFunctions';

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

    expect(requestUserProilePhotoUpload(user1.token, 'http://filesamples.com/samples/image/jpeg/sample_640x426.jpeg', 0, 0, 100, 100)).toStrictEqual(400);
    });

    test('start/end points are outside the image', () => {
    
        expect(requestUserProilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 0, 0, 1024, 1024)).toStrictEqual(400);
    });

    test('xEnd is less than xStart', () => {
    
        expect(requestUserProilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 50, 0, 10, 800)).toStrictEqual(400);
    });

    test('yEnd is less than yStart', () => {
    
        expect(requestUserProilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 0, 50, 800, 10)).toStrictEqual(400);
    });

    test('image is not a .jpg', () => {
       
        expect(requestUserProilePhotoUpload(user1.token, 'http://i.imgur.com/18C0q35.png', 0, 0, 1024, 1024)).toStrictEqual(400);
    });
    
    test('invalid user', () => {
       
        expect(requestUserProilePhotoUpload('abcde', 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 0, 0, 1024, 1024)).toStrictEqual(403);
    });

});

describe('Succesful Upload', () => {
    test('File 1', () => {
        expect(requestUserProfile(user1.token, user1.authUserId).user.profilePhoto).toStrictEqual(null);

        expect(requestUserProilePhotoUpload(user1.token, 'http://file-examples.com/storage/fe04183d33637128a9c93a7/2017/10/file_example_JPG_500kB.jpg', 200, 200, 800, 800)).toStrictEqual( {} );

        expect(requestUserProfile(user1.token, user1.authUserId).user.profilePhoto).toBe(String);
    })
})