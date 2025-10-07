import React, { useEffect, useRef } from "react";

type Props = {
  expression: "neutral" | "happy" | "sad" | "angry" | "surprised" | "shy";
  isSpeaking: boolean;
  audioElement?: React.RefObject<HTMLAudioElement | null>;
};

const FaceCanvas: React.FC<Props> = ({
  expression,
  isSpeaking,
  audioElement,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let eyeOffset = 0;
    let browOffset = 0;
    let blink = false;
    let audioLevel = 0;
    let audioAnalyser: AnalyserNode | null = null;
    let headTilt = 0;
    let eyeGaze = { x: 0, y: 0 };
    let lastEmotionChange = Date.now();

    // Setup audio analysis for mouth sync
    const setupAudioAnalysis = () => {
      if (audioElement?.current && isSpeaking) {
        try {
          const audioContext = new AudioContext();
          const source = audioContext.createMediaElementSource(
            audioElement.current
          );
          audioAnalyser = audioContext.createAnalyser();
          audioAnalyser.fftSize = 256;
          source.connect(audioAnalyser);
          audioAnalyser.connect(audioContext.destination);
        } catch (error) {
          console.warn("Could not setup audio analysis:", error);
        }
      }
    };

    setupAudioAnalysis();

    const drawFace = (openness: number) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fw = canvas.width * 0.75;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Subtle head tilt based on emotion
      ctx.translate(cx, cy);
      ctx.rotate(headTilt);
      ctx.translate(-cx, -cy);

      // Head with subtle movement
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      const headY = cy + Math.sin(Date.now() / 2000) * 2;
      ctx.ellipse(cx, headY, fw / 2, canvas.height * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      drawEyes(cx, headY, fw);
      drawEyebrows(cx, headY, fw);
      drawMouth(cx, headY, fw, openness);

      ctx.restore();
    };

    const drawEyes = (cx: number, cy: number, fw: number) => {
      ctx.fillStyle = "#007BFF";
      const offset = fw * 0.2;
      let eyeY = cy - fw * 0.08 + eyeOffset;
      let eyeW = fw * 0.1;
      let eyeH = blink ? fw * 0.015 : fw * 0.07;

      // Adjust eye shape based on emotion
      switch (expression) {
        case "happy":
          eyeH *= 0.8; // Squinted eyes when happy
          eyeY += fw * 0.02;
          break;
        case "surprised":
          eyeH *= 1.4; // Wide eyes
          eyeW *= 1.2;
          break;
        case "sad":
          eyeY += fw * 0.01; // Droopy eyes
          break;
        case "angry":
          eyeH *= 0.6; // Narrowed eyes
          eyeY -= fw * 0.01;
          break;
        case "shy":
          eyeH *= 0.7; // Slightly closed
          eyeY += fw * 0.015;
          break;
      }

      [cx - offset, cx + offset].forEach((x) => {
        ctx.beginPath();
        const safeEyeW = Math.max(Math.abs(eyeW), 1);
        const safeEyeH = Math.max(Math.abs(eyeH), 1);
        ctx.ellipse(x, eyeY, safeEyeW, safeEyeH, 0, 0, Math.PI * 2);
        ctx.fill();

        // Add pupils with gaze tracking
        if (!blink && eyeH > fw * 0.03) {
          ctx.fillStyle = "#000";
          const pupilSize = eyeW * 0.4;
          let pupilX = x + eyeGaze.x * eyeW * 0.3;
          let pupilY = eyeY + eyeGaze.y * eyeH * 0.2;

          // Pupil position based on emotion
          if (expression === "surprised") pupilY -= eyeH * 0.2;
          if (expression === "shy") {
            pupilY += eyeH * 0.1;
            pupilX += (x < cx ? -1 : 1) * eyeW * 0.2; // Look away when shy
          }

          ctx.beginPath();
          const safePupilSize = Math.max(Math.abs(pupilSize), 1);
          ctx.ellipse(
            pupilX,
            pupilY,
            safePupilSize,
            safePupilSize,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Add highlight for more life
          ctx.fillStyle = "#4da6ff";
          ctx.beginPath();
          const highlightSize = Math.max(safePupilSize * 0.3, 1);
          ctx.ellipse(
            pupilX - safePupilSize * 0.3,
            pupilY - safePupilSize * 0.3,
            highlightSize,
            highlightSize,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.fillStyle = "#007BFF";
        }
      });
    };

    const drawEyebrows = (cx: number, cy: number, fw: number) => {
      ctx.strokeStyle = "white";
      ctx.lineWidth = fw * 0.01;
      const y = cy - fw * 0.15 + browOffset;
      const xOff = fw * 0.18;

      ctx.beginPath();
      if (expression === "sad") {
        ctx.moveTo(cx - xOff, y + 10);
        ctx.lineTo(cx - xOff + fw * 0.12, y - 10);
        ctx.moveTo(cx + xOff, y - 10);
        ctx.lineTo(cx + xOff + fw * 0.12, y + 10);
      } else if (expression === "angry") {
        ctx.moveTo(cx - xOff, y - 10);
        ctx.lineTo(cx - xOff + fw * 0.12, y + 10);
        ctx.moveTo(cx + xOff, y + 10);
        ctx.lineTo(cx + xOff + fw * 0.12, y - 10);
      }
      ctx.stroke();
    };

    const drawMouth = (
      cx: number,
      cy: number,
      fw: number,
      openness: number
    ) => {
      ctx.strokeStyle = "white";
      ctx.fillStyle = "white";
      ctx.lineWidth = fw * 0.015;
      let y = cy + fw * 0.05;
      let mouthWidth = fw * 0.1;

      if (isSpeaking) {
        // Dynamic speaking mouth - ensure positive values
        ctx.fillStyle = "#ff6b6b";
        ctx.beginPath();
        const mouthRadiusX = Math.max(fw * 0.06, 1);
        const mouthRadiusY = Math.max(Math.abs(openness), 1);
        ctx.ellipse(cx, y, mouthRadiusX, mouthRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Teeth when mouth is open enough
        if (openness > 10) {
          ctx.fillStyle = "white";
          ctx.beginPath();
          const teethRadiusX = Math.max(fw * 0.04, 1);
          const teethRadiusY = Math.max(openness * 0.2, 1);
          ctx.ellipse(
            cx,
            y - openness * 0.3,
            teethRadiusX,
            teethRadiusY,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      } else {
        // Emotion-based mouth shapes
        ctx.beginPath();
        switch (expression) {
          case "happy":
            // Smile
            ctx.arc(
              cx,
              y - fw * 0.02,
              mouthWidth,
              0.2 * Math.PI,
              0.8 * Math.PI,
              false
            );
            break;
          case "sad":
            // Frown
            ctx.arc(
              cx,
              y + fw * 0.03,
              mouthWidth,
              1.2 * Math.PI,
              1.8 * Math.PI,
              false
            );
            break;
          case "surprised":
            // Open O shape
            ctx.fillStyle = "#ff6b6b";
            const surprisedWidth = Math.max(fw * 0.03, 1);
            const surprisedHeight = Math.max(fw * 0.04, 1);
            ctx.ellipse(
              cx,
              y,
              surprisedWidth,
              surprisedHeight,
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.fillStyle = "white";
            return;
          case "angry":
            // Tight line
            ctx.moveTo(cx - mouthWidth * 0.8, y);
            ctx.lineTo(cx + mouthWidth * 0.8, y);
            break;
          case "shy":
            // Small smile
            ctx.arc(
              cx,
              y,
              mouthWidth * 0.6,
              0.3 * Math.PI,
              0.7 * Math.PI,
              false
            );
            break;
          default:
            // Neutral
            ctx.arc(cx, y, mouthWidth, 0.1 * Math.PI, 0.9 * Math.PI, false);
        }
        ctx.stroke();
      }
    };

    const animate = () => {
      // More natural eye movement
      const time = Date.now();
      eyeOffset = Math.sin(time / 800) * 3 + Math.sin(time / 1200) * 2;
      browOffset = eyeOffset * 0.5;

      // Subtle head movements and tilts
      headTilt = Math.sin(time / 3000) * 0.05; // Very subtle tilt
      if (expression === "shy") headTilt += 0.1;
      if (expression === "surprised") headTilt = Math.sin(time / 500) * 0.02;

      // Natural eye gaze movement
      eyeGaze.x = Math.sin(time / 2000) * 0.8 + Math.sin(time / 3200) * 0.4;
      eyeGaze.y = Math.cos(time / 2400) * 0.5;

      // Emotion-specific gaze adjustments
      if (expression === "shy") {
        eyeGaze.y += 0.3; // Look down when shy
        eyeGaze.x += Math.sin(time / 1000) * 0.5; // Darting glances
      }
      if (expression === "angry") {
        eyeGaze.y -= 0.2; // Intense stare
        eyeGaze.x *= 0.5; // Less movement when angry
      }

      // Random blinking with varying frequency
      const blinkChance = expression === "shy" ? 0.008 : 0.003;
      if (Math.random() < blinkChance && !blink) {
        blink = true;
        const blinkDuration = 120 + Math.random() * 100;
        setTimeout(() => {
          blink = false;
        }, blinkDuration);
      }

      // Get real audio level for mouth animation
      if (audioAnalyser && isSpeaking) {
        const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
        audioAnalyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        audioLevel = Math.min(average / 5, 25); // Scale and limit
      }

      const openness = isSpeaking
        ? audioLevel > 0
          ? Math.max(audioLevel + Math.sin(time / 100) * 3, 1) // Real audio + subtle variation, minimum 1
          : Math.abs(Math.sin(time / 120)) * 15 + 3 // Fallback animation
        : 0;

      drawFace(openness);
      animationId = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [expression, isSpeaking, audioElement]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, backgroundColor: "#111" }}
    />
  );
};

export default FaceCanvas;
