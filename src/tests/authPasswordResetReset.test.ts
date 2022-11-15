import { requestClear, requestAuthRegister, requestAuthLogin, requestAuthPasswordResetRequest, requestAuthPasswordResetReset, requestUserProfile } from '../wrapperFunctions';
import { userType, getData } from '../dataStore';

requestClear(); 

beforeEach(() => {
  requestClear();
});

describe('authPasswordResetReset tests', () => {
  // test(('resetCode is not a valid reset code'), () => {
	// 	requestAuthRegister('nicole.jiang@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
	// 	requestAuthPasswordResetRequest('nicole.jiang@gmail.com');
	// 	expect(requestAuthPasswordResetReset('invalidcode', 'ABCDE12345')).toStrictEqual(400);
  // });

	// test(('newPassword is less than 6 characters long'), () => {
	// 	const data = getData();
	// 	const nicole = requestAuthRegister('nicole.jiang@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
	// 	requestAuthPasswordResetRequest('nicole.jiang@gmail.com');
	// 	const user = data.users.find(a => a.authUserId === nicole.authUserId);
	// 	expect(requestAuthPasswordResetReset(user.resetCode, 'short')).toStrictEqual(400);
	// });

	test(('successfully resetted the password'), () => {
		const data = getData();
		const nicole = requestAuthRegister('nicole.jiang@gmail.com', 'ABCD1234', 'Nicole', 'Jiang');
		requestAuthPasswordResetRequest('nicole.jiang@gmail.com');
		// const user = data.users.find(a => a.authUserId === 0);
		console.log(nicole.token);
		console.log(requestUserProfile(nicole.token, nicole.authUserId));
		//expect(requestAuthPasswordResetReset(user.resetCode, 'ABCDE12345')).toStrictEqual({});
	});
});
