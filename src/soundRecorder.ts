import { RtAudio, RtAudioFormat } from 'audify';
import { PassThrough } from 'stream';
// import { createWriteStream, createReadStream } from 'fs';
export default class SoundRecorder {
  rtAudio = new RtAudio(/* Insert here specific API if needed */);

  passthroughStream = new PassThrough({ highWaterMark: 1920 });

  open(): void {
    this.rtAudio.openStream(
      null,
      {
        deviceId: this.rtAudio.getDefaultOutputDevice(),
        nChannels: 2,
        firstChannel: 0,
      },
      RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
      48000, // Sampling rate is 48kHz
      1920, // Frame size is 1920 (40ms)
      'MyStream',
      (pcm) => this.passthroughStream.write(pcm),
      () => null,
    );
    this.rtAudio.start();
    this.passthroughStream.on('data', () => null);
  }

  close(): void {
    if (this.rtAudio.isStreamOpen()) {
      this.rtAudio.stop();
      this.rtAudio.closeStream();
    }
  }
}
