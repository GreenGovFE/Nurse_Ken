import React, { useState, useRef, useEffect } from "react";
import { Icon } from '@iconify/react';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone";

const WaveformVisualizer = ({ isListening }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'green',
      progressColor: 'purple',
      cursorColor: 'white',
      barWidth: 2,
      barGap: 1,
      barHeight: 1,
      responsive: true,
      plugins: [
        MicrophonePlugin.create({
          bufferSize: 4096,
          numberOfInputChannels: 1,
          numberOfOutputChannels: 1,
          constraints: { audio: true }
        })
      ]
    });

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      wavesurfer.current.microphone.start();
    } else {
      wavesurfer.current.microphone.stop();
    }
  }, [isListening]);

  return <div ref={waveformRef} style={{ width: '100%', height: '100px' }}></div>;
};

const SpeechToTextButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event?.results[0][0]?.transcript;
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event?.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [onTranscript]);

  const handleSpeechToText = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-v-center flex-direction-v">
      <span className="col-4">
        <WaveformVisualizer isListening={isListening} />
      </span>
      <button onClick={handleSpeechToText} className="save-drafts m-t-10" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon height={24} width={24} inline={true} color="green" icon={isListening ? 'solar:soundwave-linear' : 'solar:microphone-3-broken'} />
        <span style={{ marginLeft: '8px' }}>{isListening ? " Stop Listening" : " Start Speaking"}</span>
      </button>
    </div>
  );
};

export default SpeechToTextButton;
