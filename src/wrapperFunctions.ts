import { port, url } from './config.json';

import request, { HttpVerb } from 'sync-request';
const SERVER_URL = `${url}:${port}`;

export function requestHelper(method: HttpVerb, path: string, payload: object, header?: string) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  let headers = {};
  if (header !== undefined) {
    headers = {
      token: header
    };
  }
  const res = request(method, SERVER_URL + path, { qs, json, headers });

  if (res.statusCode !== 200) {
    // Return error code number instead of object in case of error.
    // (just for convenience)
    return res.statusCode;
  }

  return JSON.parse(res.getBody('utf-8'));
}

export function requestClear() {
  return requestHelper('DELETE', '/clear/v1', {});
}

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v3', { email, password, nameFirst, nameLast });
}

export function requestAuthLogin(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v3', { email, password });
}

export function requestAuthLogout(token: string) {
  return requestHelper('POST', '/auth/logout/v2', {}, token);
}

export function requestChannelsCreate (token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v3', { name, isPublic }, token);
}

export function requestChannelsListAll (token: string) {
  return requestHelper('GET', '/channels/listall/v3', {}, token);
}

export function requestChannelsList (token: string) {
  return requestHelper('GET', '/channels/list/v2', { }, token);
}

export function requestchannelDetails(token : string, channelId : number) {
  return requestHelper('GET', '/channel/details/v3', { channelId }, token);
}

export function requestChannelMessages(token : string, channelId : number, start: number) {
  return requestHelper('GET', '/channel/messages/v3', { channelId, start }, token);
}

export function requestChannelJoin(token : string, channelId: number) {
  return requestHelper('POST', '/channel/join/v3', { channelId }, token);
}

export function requestChannelInvite(token : string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v3', { channelId, uId }, token);
}

export function requestChannelLeave(token : string, channelId: number) {
  return requestHelper('POST', '/channel/leave/v2', { channelId }, token);
}

export function requestUserProfile (token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v3', { uId }, token);
}

export function requestDmCreate(token: string, uIds: number[]) {
  return requestHelper('POST', '/dm/create/v2', { uIds }, token);
}

export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v2', { channelId, message }, token);
}

export function requestDmRemove(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v2', { dmId }, token);
}

export function requestDmMessages(token : string, dmId : number, start: number) {
  return requestHelper('GET', '/dm/messages/v2', { dmId, start }, token);
}

export function requestDmDetails(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v2', { dmId }, token);
}

export function requestDmList(token: string) {
  return requestHelper('GET', '/dm/list/v2', {}, token);
}

export function requestUserSetName(token: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/user/profile/setname/v2', { nameFirst, nameLast }, token);
}

export function requestMessageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v2', { messageId, message }, token);
}

export function requestUsersAll(token: string) {
  return requestHelper('GET', '/users/all/v2', { }, token);
}

export function requestAddOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/addowner/v2', { channelId, uId }, token);
}

export function requestMessageSendDm(token: string, dmId: number, message: string) {
  return requestHelper('POST', '/message/senddm/v2', { dmId, message }, token);
}

export function requestDmLeave(token: string, dmId: number) {
  return requestHelper('POST', '/dm/leave/v2', { dmId }, token);
}

export function requestRemoveOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/removeowner/v2', { channelId, uId }, token);
}

export function requestUserSetHandle(token: string, handleStr: string) {
  return requestHelper('PUT', '/user/profile/sethandle/v2', { handleStr }, token);
}

export function requestUserSetEmail(token: string, email: string) {
  return requestHelper('PUT', '/user/profile/setemail/v2', { email }, token);
}

export function requestMessageRemove(token: string, messageId: number) {
  return requestHelper('DELETE', '/message/remove/v2', { messageId }, token);
}

export function requestSearch(token: string, queryStr: string) {
  return requestHelper('GET', '/search/v1', { queryStr }, token);
}
export function requestStandupStart(token: string, channelId: number, length: number) {
  return requestHelper('POST', '/standup/start/v1', { channelId, length }, token);
}
