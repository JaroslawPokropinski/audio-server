import * as express from 'express';
import SoundRecorder from './soundRecorder';
import * as wav from 'wav';

function trackRoute(recorder: SoundRecorder): express.Router {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.set('content-type', 'audio/wav');
    res.set('accept-ranges', 'bytes');

    const encoderStream = new wav.Writer({
      sampleRate: 48000,
      channels: 2,
      bitDepth: 16,
    });

    recorder.passthroughStream.pipe(encoderStream);
    encoderStream.pipe(res);

    req.on('close', () => {
      console.log('Client closed connection');
      recorder.passthroughStream.unpipe(encoderStream);
      encoderStream.unpipe(res);
      res.end();
    });
  });
  return router;
}

export default trackRoute;
