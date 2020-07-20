import express from 'express';
import http from 'http';
import { join } from 'path';
import trackRoute from './trackRoute';
import SoundRecorder from './soundRecorder';

const app = express();
const server = http.createServer(app);

const recorder = new SoundRecorder();
recorder.open();

app.use(express.static('audio-client/build'));

app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'audio-client', 'build', '/index.html'));
});

app.use('/track', trackRoute(recorder));
server.listen(3050, () => console.log(`Example app listening at http://localhost:${3050}`));
