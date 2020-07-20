import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Howl, Howler } from 'howler';

import play from './play.svg';
import stop from './stop.svg';
import './App.css';

const getUrl = () => {
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3050/';
  }
  return window.location.href;
};

const createHowl = (isPlaying: boolean) => {
  if (isPlaying) {
    const s = new Howl({
      src: [`${getUrl()}track`],
      format: ['wav'],
      html5: true,
    });
    s.play();
    Howler.volume(1.0);
    return s;
  } else {
    return null;
  }
};

function App(): JSX.Element {
  const [isPlaying, setPlaying] = useState(false);
  const player = useRef<HTMLAudioElement>(null);
  const sound = useMemo(() => createHowl(isPlaying), [isPlaying]);

  useEffect(() => {
    const itr = setInterval(() => {
      console.log('Duration: ' + sound?.duration());
      console.log('Position: ' + sound?.seek());
    }, 1000);
    return () => clearInterval(itr);
  }, [sound]);

  return (
    <div className="App">
      {isPlaying ? (
        <img
          src={stop}
          className="button"
          alt="stop button"
          onClick={() => {
            if (player.current) {
              console.log(sound);
              console.log('Duration: ' + sound?.duration());
              console.log('Position: ' + sound?.seek());
              sound?.stop();
              sound?.unload();
              setPlaying(false);
            }
          }}
        />
      ) : (
        <img
          src={play}
          className="button"
          alt="play button"
          onClick={() => {
            if (player.current) {
              setPlaying(true);
            }
          }}
        />
      )}
      <audio id="player" ref={player}>
        <source src="" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
