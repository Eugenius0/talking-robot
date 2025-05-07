import React from "react";
import "./ControlPanel.css";

interface ControlPanelProps {
  onTalk: () => void;
  status: string;
  inputText: string;
  replyText: string;
  isListening: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onTalk,
  status,
  inputText,
  replyText,
  isListening,
}) => {
  return (
    <div id="ui">
      <h1>Talking Robot</h1>
      <button
        id="talkBtn"
        onClick={onTalk}
        disabled={isListening}
        style={{
          backgroundColor: isListening ? "#aaa" : "#007BFF",
          cursor: isListening ? "not-allowed" : "pointer",
        }}
      >
        🎤 Talk to Embeddy
      </button>
      <p>
        <strong>Status:</strong> <span id="status">{status}</span>
      </p>
      <p>
        <strong>You said:</strong> <span id="inputText">{inputText}</span>
      </p>
      <p>
        <strong>ChatGPT says:</strong> <span id="replyText">{replyText}</span>
      </p>
      <audio id="audioPlayer" autoPlay controls style={{ display: "none" }}>
        <track
          kind="captions"
          src="captions.vtt"
          srcLang="en"
          label="English captions"
        />
      </audio>
    </div>
  );
};

export default ControlPanel;
