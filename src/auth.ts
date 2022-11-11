import validator from 'validator';
import HTTPError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

import { getData, setData } from './dataStore';
import { getToken, getHashOf, SECRET } from './helperFunctions';

/**
 * <Description: Given a valid email, password, first name and last name, this function will create a user account and return a unique id .>
 * @param {string} email - valid email id for user
 * @param {string} password - valid password for user
 * @param {string} first name - valid first name for user
 * @param {string} last name  - valid last name for user
 * @returns {number} authUserId - unique Id of the user
 */

export function authRegisterV3(email: string, password: string, nameFirst: string, nameLast: string): {token: string, authUserId: number} | {error: string} {
  const data = getData();
  // checks whether email, password, first name and last name are valid
  if (!validator.isEmail(email) || password.length < 6 || nameFirst.length < 1 ||
        nameFirst.length > 50 || nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, 'Error: Invalid Details.');
  }
  // checks whether email is already in use by another user
  if (data.users.find(users => users.email === email)) {
    throw HTTPError(400, 'Error: Email is already in use.');
  }

  // create user handle
  let userHandle = (nameFirst.toLowerCase() + nameLast.toLowerCase()).replace(/[^a-z0-9]/gi, '');

  if (userHandle.length > 20) {
    userHandle = userHandle.substring(0, 20);
  }

  // Check if user handle is taken
  if (data.users.find(users => users.userHandle === userHandle)) {
    let counter = 0;
    // increment counter until a new unique handle is created
    while (data.users.find(users => users.userHandle === userHandle + counter)) {
      counter++;
    }
    userHandle = userHandle + counter;
  }
  let id = 0;
  // increment counter until a new unique handle is created
  while (data.users.find(users => users.authUserId === id)) {
    id++;
  }
  // generate a string token
  const token = uuidv4();
  const tokenHashed = getHashOf(token + SECRET);

  // Hasing the passwordd
  const passwordHashed = getHashOf(password);

  // Assign, push and set the data
  data.users.push(
    {
      authUserId: id,
      userHandle: userHandle,
      email: email,
      password: passwordHashed,
      nameFirst: nameFirst,
      nameLast: nameLast,
      sessions: [tokenHashed],
      resetCode: null
    }
  );

  setData(data);
  return {
    token: token,
    authUserId: id
  };
}
/**
 * <Description: Given a registered user's email and password, returns their authUserId value.>
 * @param {string} email
 * @param {string} password
 * @returns {number} authUserId - unique Id of the user
 * @returns {string} token
 */
export function authLoginV3(email: string, password: string): {token: string, authUserId: number} | {error: string} {
  const data = getData();
  const array = data.users;
  for (const num in array) {
    if (array[num].email === email) {
      if (array[num].password === getHashOf(password)) {
        const token = uuidv4();
        const tokenHashed = getHashOf(token + SECRET);
        array[num].sessions.push(tokenHashed);
        return {
          token: token,
          authUserId: array[num].authUserId
        };
      } else {
        throw HTTPError(400, 'Error: Invalid Password');
      }
    }
  }
  throw HTTPError(400, 'Error: Invalid Email');
}

/**
 * <Description: Given a valid token it logout that particular user's correspondingsession>
 * @param {string} token
 * @returns {}
 */

export function authLogoutV2(token: string): Record<string, never> | {error: string} {
  const data = getData();
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, 'Error: Invalid Token');
  }
  // Get index of token in order to remove it
  const index = user.sessions.indexOf(tokenHashed);

  for (const users of data.users) {
    if (users.authUserId === user.authUserId) {
      users.sessions.splice(index, 1);
    }
  }
  setData(data);

  return {};
}

export function authPasswordResetRequestV1(email: string) : Record<string, never> {
  const data = getData();

  const user = data.users.find(a => a.email === email);

  if (user === undefined) {
    return {};
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 't15adream1@gmail.com',
      pass: 'cnjeixndgpzxtxir'
    }
  });

  const resetCode = Math.random().toString(36).substring(2, 15);
  const mailOptions = {
    from: 't15adream1@gmail.com',
    to: email,
    subject: 'Password Reset Code',
    text: `Here is your requested reset code, ${resetCode}`
  };

  user.resetCode = resetCode;

  transporter.sendMail(mailOptions);

  user.sessions.length = 0;
  // Clears all the current sessions.

  // email t15adream1@gmail.com
  // pass cnjeixndgpzxtxir
  // https://www.receivesms.org/us-phone-number/3640/
  return {};
}
