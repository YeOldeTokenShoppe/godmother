import { useEffect, useRef, useState } from "react";
import "../../styles/record.css";
import Script from "next/script";

const RecordPlayer = () => {
  const [audioCtx, setAudioCtx] = useState(null);
  const [source, setSource] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [speed, setSpeed] = useState(1);
  const playButton = useRef(null);
  const stopButton = useRef(null);
  const vinyl = useRef(null);

  const songs = [
    { url: "/Hot-Chocolate-Every-1s-A-Winner.mp3", img: "/every1.jpg" },
    { url: "/OxOutTheCage.mp3", img: "/cannibalOx.jpg" },
    { url: "/takeMeToChurch.mp3", img: "/every1.jpg" },
  ];

  useEffect(() => {
    const play = playButton.current;
    const stop = stopButton.current;

    const handlePlayClick = async () => {
      document.body.classList.add("playing");
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      await handleSongSelection(randomSong);
      await playAudio();
    };

    const handleStopClick = () => {
      document.body.classList.remove("playing");
      if (source) {
        source.stop();
      }
      play.disabled = false;
    };

    play.addEventListener("click", handlePlayClick);
    stop.addEventListener("click", handleStopClick);

    return () => {
      play.removeEventListener("click", handlePlayClick);
      stop.removeEventListener("click", handleStopClick);
    };
  }, [audioCtx, source]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      window.gsap.to("body", {
        opacity: 1,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.05,
          onLeave: function () {
            window.scrollTo(0, 0);
          },
          onScrubComplete: (self) => {
            setSpeed(1);
            document.body.style.setProperty("--cursor", "grab");
            if (playButton.current.disabled === true) {
              source.playbackRate.value = speed;
              document.body.style.setProperty("--speed", 1);
            }
            if (self.progress === 0) {
              window.scrollTo(0, document.body.scrollHeight);
            }
          },
          onUpdate: ({ getVelocity }) => {
            let newSpeed = 1;
            if (getVelocity() < 1) {
              newSpeed = Math.max(1 - Math.abs(getVelocity() / 3000), 0.05);
            } else {
              newSpeed = 1 + Math.abs(getVelocity() / 3000);
            }
            setSpeed(newSpeed);
            document.body.style.setProperty("--speed", newSpeed);
            if (playButton.current.disabled === true) {
              document.body.style.setProperty("--cursor", "grabbing");
              source.playbackRate.value = newSpeed;
            }
          },
        },
      });
    }
  }, []);

  const loadAudio = async (url) => {
    try {
      const response = await fetch(url);
      const audioBuffer = await audioCtx.decodeAudioData(
        await response.arrayBuffer()
      );
      setBuffer(audioBuffer);
    } catch (err) {
      console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
  };

  const handleSongSelection = async (song) => {
    vinyl.current.style.backgroundImage = `radial-gradient(circle at center, #ccc -0.5vmin, #777 1.5vmin, transparent 1vmin, transparent 26%, #111 27.5%, #111), url(${song.img}) 50% 50% / 43% 43% no-repeat`;
    if (source) {
      source.stop();
      playButton.current.disabled = false;
      document.body.classList.remove("playing");
    }
    if (!audioCtx) {
      setAudioCtx(new AudioContext());
    }
    await loadAudio(song.url);
  };

  const playAudio = async () => {
    if (!audioCtx) {
      setAudioCtx(new AudioContext());
    }
    const audioSource = audioCtx.createBufferSource();
    audioSource.buffer = buffer;
    audioSource.connect(audioCtx.destination);
    audioSource.loop = true;
    audioSource.start();
    setSource(audioSource);
    playButton.current.disabled = true;
  };

  return (
    <div className="recordPlayer">
      <Script
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/gsap-latest-beta.min.js?r=5426"
        strategy="beforeInteractive"
      />
      <Script
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/ScrollTrigger.min.js"
        strategy="beforeInteractive"
      />
      <button id="play" ref={playButton} className="play">
        Play
      </button>
      <button id="stop" ref={stopButton} className="stop">
        Stop
      </button>
      <div id="needle" className="needle"></div>
      <div id="vinyl" className="vinyl" ref={vinyl}></div>
    </div>
  );
};

export default RecordPlayer;
