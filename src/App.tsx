import React from "react";
import FaceCanvas from "./components/FaceCanvas";
import ControlPanel from "./components/ControlPanel";
import { useVoiceAssistant } from "./components/useVoiceAssistant";

const App = () => {
  const {
    startListening,
    status,
    inputText,
    replyText,
    emotion,
    isListening,
    isSpeaking,
    audioPlayer,
  } = useVoiceAssistant();

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <FaceCanvas
        expression={emotion}
        isSpeaking={isSpeaking}
        audioElement={audioPlayer}
      />
      <ControlPanel
        onTalk={startListening}
        status={status}
        inputText={inputText}
        replyText={replyText}
        isListening={isListening}
        audioPlayer={audioPlayer}
      />
    </div>
  );
};

export default App;
