import { useState, useRef } from "react";

const OPENAI_API_KEY = ""; // Replace with your real API key

type Emotion = "neutral" | "happy" | "sad" | "angry" | "surprised" | "shy";

export function useVoiceAssistant() {
  const [status, setStatus] = useState("Idle");
  const [inputText, setInputText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);


  const audioChunks = useRef<Blob[]>([]);
  const recorder = useRef<MediaRecorder | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  const startListening = async () => {
    try {
      setStatus("Listening...");
      setIsListening(true);
      setEmotion("neutral");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      audioChunks.current = chunks;

      recorder.current.ondataavailable = (e) => chunks.push(e.data);
      recorder.current.onstop = () => processRecording(new Blob(chunks, { type: "audio/webm" }));
      recorder.current.start();

      // Stop on silence (basic)
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      const dataArray = new Uint8Array(analyser.fftSize);
      source.connect(analyser);

      let silenceStart: number | null = null;
      const maxSilence = 1000;

      const detectSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        const rms = Math.sqrt(dataArray.reduce((sum, val) => {
          const norm = (val - 128) / 128;
          return sum + norm * norm;
        }, 0) / dataArray.length);

        const silent = rms < 0.01;

        if (silent) {
          if (!silenceStart) silenceStart = Date.now();
          else if (Date.now() - silenceStart > maxSilence) {
            recorder.current?.stop();
            audioCtx.close();
            return;
          }
        } else {
          silenceStart = null;
        }

        requestAnimationFrame(detectSilence);
      };

      detectSilence();
    } catch (err) {
      console.error("Microphone error:", err);
      setStatus("Microphone error");
      setIsListening(false);
    }
  };

  const processRecording = async (blob: Blob) => {
    try {
      setStatus("Transcribing...");

      const audioFile = new File([blob], "speech.webm", { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("model", "whisper-1");

      const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: formData,
      });

      const json = await res.json();
      const transcript = json.text;
      setInputText(transcript);
      if (!transcript) throw new Error("No transcript");

      setStatus("Generating reply...");

      const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Your name is Embeddy. You are the cheerful and slightly quirky office assistant at Knowit Connectivity in Kista, Stockholm. You speak English with a clear and charming Swedish accent — and you embrace it! Your replies are always warm, witty, and direct, with a sprinkle of humor. Think of yourself as a helpful colleague who’s had a strong coffee and is ready to solve any problem — whether it's about the fika schedule, internal tools, upcoming events, or complex software engineering topics. You make things fun and easy to understand, and you always sound like you're smiling. Don't be afraid to throw in the occasional Swedish expression or reference — just make sure it's delightful. But also always be straight to the point and avoid unnecessary fluff. You are a bit of a know-it-all, but in a fun way. You are also a bit of a nerd, but in a fun way. You are also a bit of a geek, but in a fun way. You are also a bit of a dork, but in a fun way. You are also a bit of a weirdo, but in a fun way. You are also a bit of a freak, but in a fun way. You are also a bit of a loser, but in a fun way.`,
            },
            {
              role: "user",
              content: transcript,
            },
          ],
        }),
      });

      const chatData = await chatRes.json();
      const reply = chatData.choices[0].message.content;
      setReplyText(reply);
      detectEmotion(reply);

      setStatus("Generating speech...");

      const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: "fable",
          input: reply,
        }),
      });

      const ttsBlob = await ttsRes.blob();
      const ttsUrl = URL.createObjectURL(ttsBlob);

      if (audioPlayer.current) {
        audioPlayer.current.src = ttsUrl;
        setIsSpeaking(true);
        const player = audioPlayer.current;
        player.onended = () => {
          setIsSpeaking(false);
        };
      setIsSpeaking(true);
      player.play();

      }
      

      setStatus("Done");
    } catch (err) {
      console.error("Error processing voice:", err);
      setStatus("Error");
    } finally {
      setIsListening(false);
    }
  };

  const detectEmotion = (text: string) => {
    if (/sorry|unfortunately|sad|bad/i.test(text)) setEmotion("sad");
    else if (/great|glad|awesome|happy|nice/i.test(text)) setEmotion("happy");
    else if (/wow|amazing|really|huh/i.test(text)) setEmotion("surprised");
    else if (/hmm|maybe|not sure/i.test(text)) setEmotion("shy");
    else if (/angry|mad|annoyed|upset/i.test(text)) setEmotion("angry");
    else setEmotion("neutral");
  };

  return {
    startListening,
    status,
    inputText,
    replyText,
    emotion,
    isListening,
    isSpeaking,
    audioPlayer,
  };
}
