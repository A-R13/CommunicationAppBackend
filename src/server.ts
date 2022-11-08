import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { readData, saveData, wipeData } from './dataStore';
import { authRegisterV3, authLoginV2, authLogoutV2 } from './auth';
import { channelDetailsV3, channelJoinV3, channelInviteV2, channelMessagesV3, channelleaveV2, addOwnerV1, removeOwnerV1 } from './channel';
import { channelsCreateV3, channelsListV2, channelsListAllV3 } from './channels';

import { dmCreateV2, messageSendV2, dmMessagesV2, dmRemoveV2, dmDetailsV2, dmListV2, messageEditV2, messageSendDmV2, dmLeaveV2, messageRemoveV2 } from './messages';
import { userProfileV3, usersAllV2, userSetNameV1, userSetEmailV1, userSetHandleV1 } from './users';

import { clearV1 } from './other';

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  readData();
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  wipeData();
  res.json(clearV1());
});

app.post('/auth/login/v2', (req: Request, res: Response, next) => {
  const { email, password } = req.body;

  res.json(authLoginV2(email, password));
  saveData();
});

app.post('/auth/register/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    saveData();
    return res.json(authRegisterV3(email, password, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.post('/channels/create/v3', (req: Request, res: Response, next) => {
  try {
    const { name, isPublic } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(channelsCreateV3(token, name, isPublic));
  } catch (err) {
    next(err);
  }
});

app.get('/channels/listall/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    return res.json(channelsListAllV3(token));
  } catch (err) {
    next(err);
  }
});

app.get('/user/profile/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const uId = req.query.uId as string;
    return res.json(userProfileV3(token, parseInt(uId)));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/details/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.query.channelId as string;
    return res.json(channelDetailsV3(token, parseInt(channelId)));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/messages/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = req.query.channelId as string;
    const start = req.query.start as string;

    return res.json(channelMessagesV3(token, parseInt(channelId), parseInt(start)));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/join/v3', (req: Request, res: Response, next) => {
  try {
    const { channelId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(channelJoinV3(token, parseInt(channelId)));
  } catch (err) {
    next(err);
  }
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

app.post('/channel/leave/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(channelleaveV2(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/create/v2', (req: Request, res: Response, next) => {
  try {
    const { uIds } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(dmCreateV2(token, uIds));
  } catch (err) {
    next(err);
  }
});

app.post('/message/send/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId, message } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(messageSendV2(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.put('/message/edit/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, message } = req.body;
    saveData();

    return res.json(messageEditV2(token, messageId, message));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/logout/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    saveData();

    return res.json(authLogoutV2(token));
  } catch (err) {
    next(err);
  }
});

app.delete('/dm/remove/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.query.dmId as string;
    saveData();

    return res.json(dmRemoveV2(token, parseInt(dmId)));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/messages/v2', (req: Request, res: Response, next) => {
  try {
    const dmId = req.query.dmId as string;
    const start = req.query.start as string;
    const token = req.header('token');

    saveData();
    return res.json(dmMessagesV2(token, parseInt(dmId), parseInt(start)));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/details/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = req.query.dmId as string;

    res.json(dmDetailsV2(token, parseInt(dmId)));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/list/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    return res.json(dmListV2(token));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setname/v1', (req: Request, res: Response, next) => {
  const { token, nameFirst, nameLast } = req.body;

  res.json(userSetNameV1(token, nameFirst, nameLast));
  saveData();
});

app.get('/users/all/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');

    return res.json(usersAllV2(token));
  } catch (err) {
    next(err);
  }
});

app.post('/message/senddm/v2', (req: Request, res: Response, next) => {
  try {
    const { dmId, message } = req.body;
    const token = req.header('token');

    res.json(messageSendDmV2(token, parseInt(dmId), message));
    saveData();
  } catch (err) {
    next(err);
  }
});

app.post('/dm/leave/v2', (req: Request, res: Response, next) => {
  try {
    const { dmId } = req.body;
    const token = req.header('token');

    saveData();
    return res.json(dmLeaveV2(token, parseInt(dmId)));
  } catch (err) {
    next(err);
  }
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

app.delete('/message/remove/v2', (req: Request, res: Response, next) => {
  try {
    const messageId = req.query.messageId as string;
    const token = req.header('token');

    saveData();
    return res.json(messageRemoveV2(token, parseInt(messageId)));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
