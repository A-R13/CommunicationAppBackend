import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { readData, saveData, wipeData } from './dataStore';
import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { channelDetailsV2, channelJoinV2, channelInviteV2, channelMessagesV2, channelleaveV1, addOwnerV1, removeOwnerV1 } from './channel';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';

import { dmCreateV1, messageSendV1, dmMessagesV1, dmRemoveV1, dmDetailsV1, dmListV1, messageEditV1, messageSendDmV1, dmLeaveV1, messageRemoveV1, messageUnpinV1 } from './messages';
import { userProfileV2, usersAllV1, userSetNameV1, userSetEmailV1, userSetHandleV1 } from './users';

import { clearV1 } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// for logging errors (print to terminal)
app.use(morgan('dev'));

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

app.delete('/wipe/v1', (req: Request, res: Response) => {
  res.json(wipeData());
});

app.post('/auth/login/v2', (req: Request, res: Response, next) => {
  const { email, password } = req.body;

  readData();
  res.json(authLoginV2(email, password));
  saveData();
});

app.post('/auth/register/v2', (req: Request, res: Response, next) => {
  const { email, password, nameFirst, nameLast } = req.body;

  readData();
  res.json(authRegisterV2(email, password, nameFirst, nameLast));
  saveData();
});

app.post('/channels/create/v2', (req: Request, res: Response, next) => {
  const { token, name, isPublic } = req.body;

  res.json(channelsCreateV2(token, name, isPublic));
  saveData();
});

app.get('/channels/listall/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(channelsListAllV2(token));
});

app.get('/user/profile/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const uId = req.query.uId as string;

  res.json(userProfileV2(token, parseInt(uId)));
});

app.get('/channel/details/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;

  res.json(channelDetailsV2(token, parseInt(channelId)));
});

app.get('/channel/messages/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;
  const start = req.query.start as string;

  res.json(channelMessagesV2(token, parseInt(channelId), parseInt(start)));
});

app.post('/channel/join/v2', (req: Request, res: Response, next) => {
  const { token, channelId } = req.body;

  res.json(channelJoinV2(token, parseInt(channelId)));
  saveData();
});

app.post('/channel/invite/v2', (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;

  res.json(channelInviteV2(token, parseInt(channelId), parseInt(uId)));
  saveData();
});

app.post('/channel/removeowner/v1', (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;

  res.json(removeOwnerV1(token, parseInt(channelId), parseInt(uId)));
  saveData();
});

app.post('/channel/addowner/v1', (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;

  res.json(addOwnerV1(token, parseInt(channelId), parseInt(uId)));
  saveData();
});

app.get('/channels/list/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(channelsListV2(token));
});

app.post('/channel/leave/v1', (req: Request, res: Response, next) => {
  const { token, channelId } = req.body;

  res.json(channelleaveV1(token, channelId));
  saveData();
});

app.post('/dm/create/v1', (req: Request, res: Response, next) => {
  const { token, uIds } = req.body;

  res.json(dmCreateV1(token, uIds));
  saveData();
});

app.post('/message/send/v1', (req: Request, res: Response, next) => {
  const { token, channelId, message } = req.body;

  res.json(messageSendV1(token, channelId, message));
  saveData();
});

app.put('/message/edit/v1', (req: Request, res: Response, next) => {
  const { token, messageId, message } = req.body;

  res.json(messageEditV1(token, messageId, message));
  saveData();
});

app.post('/auth/logout/v1', (req: Request, res: Response, next) => {
  const { token } = req.body;

  res.json(authLogoutV1(token));
  saveData();
});

app.delete('/dm/remove/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;

  res.json(dmRemoveV1(token, parseInt(dmId)));
  saveData();
});

app.get('/dm/messages/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const start = req.query.start as string;

  res.json(dmMessagesV1(token, parseInt(dmId), parseInt(start)));
});

app.get('/dm/details/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;

  res.json(dmDetailsV1(token, parseInt(dmId)));
});

app.get('/dm/list/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(dmListV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response, next) => {
  const { token, nameFirst, nameLast } = req.body;

  res.json(userSetNameV1(token, nameFirst, nameLast));
  saveData();
});

app.get('/users/all/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;

  res.json(usersAllV1(token));
});

app.post('/message/senddm/v1', (req: Request, res: Response, next) => {
  const { token, dmId, message } = req.body;

  res.json(messageSendDmV1(token, parseInt(dmId), message));
  saveData();
});

app.post('/dm/leave/v1', (req: Request, res: Response, next) => {
  const { token, dmId } = req.body;

  res.json(dmLeaveV1(token, parseInt(dmId)));
  saveData();
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response, next) => {
  const { token, handleStr } = req.body;

  res.json(userSetHandleV1(token, handleStr));
  saveData();
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response, next) => {
  const { token, email } = req.body;

  res.json(userSetEmailV1(token, email));
  saveData();
});

app.delete('/message/remove/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const messageId = req.query.messageId as string;

  res.json(messageRemoveV1(token, parseInt(messageId)));
  saveData();
});

app.post('/message/unpin/v1', (req: Request, res: Response, next) => {
  try {
    const { messageId } = req.body;
    const token = req.header('token');

    saveData();
    res.json(messageUnpinV1(token, messageId));
  } catch (err) {
    next(err);
  }
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
