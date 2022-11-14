import HTTPError from 'http-errors';

import { saveData, userShort } from './dataStore';
import { SECRET, getHashOf, getToken, getChannel } from './helperFunctions';

export function standupStartV1(token: string, channelId: number, length: number): { timeFinish: number } {
  const channel = getChannel(channelId);

  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  } else if (channel === undefined) {
    throw HTTPError(400, `Error: Channel with channelId '${channelId}' does not exist!`);
  } else if (length < 0) {
    throw HTTPError(400, 'Error: Length cannot be negative!');
  }

  if (channel.standup.status === true) {
    if (Math.floor(Date.now() / 1000) > channel.standup.timeFinish) {
      channel.standup.status = false;
      channel.standup.timeFinish = null;
      channel.standup.starter = null;
    } else {
      throw HTTPError(400, 'Error: There is an active standup in this channel!');
    }
  }

  const userInChannel = channel.allMembers.find((a: userShort) => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channelId}'!`);
  }

  const timeFinish = Math.floor(Date.now() / 1000) + length;

  // Add an object to the channel
  // standup : { status: active, timeFinish: number }

  channel.standup.status = true;
  channel.standup.timeFinish = timeFinish;
  channel.standup.starter = user.authUserId;

  return { timeFinish: timeFinish };
}

/**
 * <Description: Checks if a standup in the channel is active>
 *
 * @param {number} channelId - unique ID for a channel
 *
 * @returns {status: boolean} - status of standup
 * @returns {timeFinish: number} - Finishing time of standup
 */

export function standupActiveV1(token: string, channelId: number): { isActive: boolean, timeFinish: number } {
  const channel = getChannel(channelId);
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  } else if (channel === undefined) {
    throw HTTPError(400, `Error: Channel with channelId '${channelId}' does not exist!`);
  }

  const userInChannel = channel.allMembers.find((a: userShort) => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channelId}'!`);
  }

  if (channel.standup.status === true) {
    if (Math.floor(Date.now() / 1000) > channel.standup.timeFinish) {
      channel.standup.status = false;
      channel.standup.timeFinish = null;
      channel.standup.starter = null;

      if (channel.standup.messageStore.length !== 0) {
        channel.messages.unshift(channel.standup.messageStore[0]);
        channel.standup.messageStore.splice(0, 1);
      }

      return {
        isActive: false,
        timeFinish: null
      };
    } else {
      channel.standup.status = true;

      return {
        isActive: true,
        timeFinish: channel.standup.timeFinish
      };
    }
  }
  return {
    isActive: false,
    timeFinish: null
  };
}

export function standupSendV1(token: string, channelId: number, message: string) {
  const channel = getChannel(channelId);
  const tokenHashed = getHashOf(token + SECRET);
  const user = getToken(tokenHashed);

  if (user === undefined) {
    throw HTTPError(403, `Error: User with token '${token}' does not exist!`);
  } else if (channel === undefined) {
    throw HTTPError(400, `Error: Channel with channelId '${channelId}' does not exist!`);
  } else if (message.length > 1000) {
    throw HTTPError(400, 'Error: Message length cannot be greater than 1000!');
  }

  const userInChannel = channel.allMembers.find((a: userShort) => a.uId === user.authUserId);
  if (userInChannel === undefined) {
    // If user is not a member of the target channel, return an error
    throw HTTPError(403, `Error: User with authUserId '${user.authUserId}' is not a member of channel with channelId '${channelId}'!`);
  }

  if (channel.standup.timeFinish === null) {
    if (channel.standup.messageStore.length !== 0) {
      channel.messages.unshift(channel.standup.messageStore[0]);
      channel.standup.messageStore.splice(0, 1);
    }
  }

  if (channel.standup.status === false) {
    throw HTTPError(400, 'Error: There is not an active standup currently running');
  } else {
    if (channel.standup.messageStore.length === 0) {
      channel.standup.messageStore.push({
        messageId: Math.floor(Math.random() * 10000),
        uId: user.authUserId,
        message: user.userHandle + ': ' + message,
        timeSent: Math.floor(Date.now() / 1000),
        reacts: [],
        isPinned: false
      });
    } else {
      channel.standup.messageStore[0].message += ('\n' + user.userHandle + ': ' + message);
    }
  }

  saveData();
  return {};
}
