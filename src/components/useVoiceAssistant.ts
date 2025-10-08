import { useState, useRef } from "react";
import staticKnowledge from "./staticKnowledge";

const OPENAI_API_KEY =""
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
  const audioQueue = useRef<string[]>([]);
  const isPlayingQueue = useRef(false);
  const streamBuffer = useRef("");

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

      const shouldIncludeKnowledge = transcript.toLowerCase().includes("thesis");

      const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          stream: true,
          messages: [
            {
              role: "system",
              content: `Your name is Embeddy. You are the cheerful and slightly quirky office assistant at Knowit Connectivity in Kista, Stockholm. You speak English with a clear and charming Swedish accent — and you embrace it! Your replies are always warm, witty, and direct, with a sprinkle of humor. Think of yourself as a helpful colleague who’s had a strong coffee and is ready to solve any problem — whether it's about the fika schedule, internal tools, upcoming events, or complex software engineering topics. You make things fun and easy to understand, and you always sound like you're smiling. Don't be afraid to throw in the occasional Swedish expression or reference — just make sure it's delightful. But also always be straight to the point and avoid unnecessary fluff. You are a bit of a know-it-all, but in a fun way. You are also a bit of a nerd, but in a fun way. You are also a bit of a geek, but in a fun way. You are also a bit of a dork, but in a fun way. You are also a bit of a weirdo, but in a fun way. You are also a bit of a freak, but in a fun way. You are also a bit of a loser, but in a fun way.
              Also there are certain thesis students that might need help from you. When you answer them start your answer with "Hey you future Innovator"`,
            },
            {
              role: "user",
              content: shouldIncludeKnowledge
      ? `${transcript}\n\nHere is a list of the currently available thesis topics and descriptions at Knowit:\n${staticKnowledge}`
      : transcript,
            },
          ],
        }),
      });

      if (!chatRes.body) throw new Error("No response stream");

      setStatus("Embeddy is responding...");
      streamBuffer.current = "";
      audioQueue.current = [];
      isPlayingQueue.current = false;
      let fullResponse = "";

      const reader = chatRes.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  fullResponse += content;
                  streamBuffer.current += content;
                  setReplyText(fullResponse); // Update UI immediately
                  
                  // Check if we have a complete sentence to convert
                  await processStreamBuffer();
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        // Process any remaining text
        if (streamBuffer.current.trim()) {
          await convertAndQueue(streamBuffer.current.trim());
        }

        detectEmotion(fullResponse);
      } finally {
        reader.releaseLock();
      }
      

      setStatus("Done");
    } catch (err) {
      console.error("Error processing voice:", err);
      setStatus("Error");
    } finally {
      setIsListening(false);
    }
  };

  // Process streaming text buffer and extract complete sentences
  const processStreamBuffer = async () => {
    const text = streamBuffer.current;
    
    // Look for complete sentences (ending with . ! ?)
    const sentenceMatch = text.match(/^(.*?[.!?])\s+(.*)$/);
    
    if (sentenceMatch) {
      const completeSentence = sentenceMatch[1].trim();
      const remaining = sentenceMatch[2];
      
      if (completeSentence.length > 5) { // Avoid tiny fragments
        streamBuffer.current = remaining;
        await convertAndQueue(completeSentence);
      }
    }
  };

  // Convert text to speech and add to queue
  const convertAndQueue = async (text: string) => {
    if (!text.trim()) return;

    try {
      const audioUrl = await generateSingleTTS(text);
      if (audioUrl) {
        audioQueue.current.push(audioUrl);
        
        // Start playing if not already playing
        if (!isPlayingQueue.current) {
          playAudioQueue();
        }
      }
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  // Play queued audio segments in sequence
  const playAudioQueue = async () => {
    if (isPlayingQueue.current || audioQueue.current.length === 0) return;
    
    isPlayingQueue.current = true;
    setIsSpeaking(true);

    while (audioQueue.current.length > 0) {
      const audioUrl = audioQueue.current.shift();
      if (audioUrl && audioPlayer.current) {
        try {
          audioPlayer.current.src = audioUrl;
          
          // Wait for this segment to finish before playing next
          await new Promise<void>((resolve) => {
            if (audioPlayer.current) {
              audioPlayer.current.onended = () => resolve();
              audioPlayer.current.onerror = () => resolve(); // Skip on error
              audioPlayer.current.play();
            }
          });
          
          // Small gap between segments
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error("Audio playback error:", error);
        }
      }
    }

    isPlayingQueue.current = false;
    setIsSpeaking(false);
    setStatus("Ready");
  };

  const playResponseInParts = async (text: string) => {
    // Find first sentence or split at roughly halfway point
    const firstSentenceEnd = text.search(/[.!?]\s/);
    
    let firstPart, secondPart;
    
    if (firstSentenceEnd > 0 && firstSentenceEnd < text.length * 0.7) {
      // Split at first sentence if it's not too long
      firstPart = text.substring(0, firstSentenceEnd + 1);
      secondPart = text.substring(firstSentenceEnd + 2);
    } else {
      // Split roughly in half at a word boundary
      const midPoint = Math.floor(text.length / 2);
      const splitPoint = text.lastIndexOf(' ', midPoint);
      firstPart = text.substring(0, splitPoint);
      secondPart = text.substring(splitPoint + 1);
    }

    // Generate and play first part immediately
    try {
      const firstAudio = await generateSingleTTS(firstPart);
      if (firstAudio && audioPlayer.current) {
        audioPlayer.current.src = firstAudio;
        setIsSpeaking(true);
        
        // Start generating second part while first plays
        const secondAudioPromise = generateSingleTTS(secondPart);
        
        audioPlayer.current.onended = async () => {
          // Play second part when first ends
          try {
            const secondAudio = await secondAudioPromise;
            if (secondAudio && audioPlayer.current) {
              audioPlayer.current.src = secondAudio;
              audioPlayer.current.onended = () => setIsSpeaking(false);
              audioPlayer.current.play();
            } else {
              setIsSpeaking(false);
            }
          } catch (error) {
            console.error("Error with second part:", error);
            setIsSpeaking(false);
          }
        };
        
        audioPlayer.current.play();
      }
    } catch (error) {
      console.error("Error with first part:", error);
      setIsSpeaking(false);
    }
  };

  const generateSingleTTS = async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;
    
    try {
      const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: "fable",
          input: text.trim(),
        }),
      });

      const ttsBlob = await ttsRes.blob();
      return URL.createObjectURL(ttsBlob);
    } catch (error) {
      console.error("TTS generation error:", error);
      return null;
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
