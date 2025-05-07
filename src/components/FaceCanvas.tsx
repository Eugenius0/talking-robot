import React, { useEffect, useRef } from "react";

type Props = {
  expression: "neutral" | "happy" | "sad" | "angry" | "surprised" | "shy";
  isSpeaking: boolean;
};

const FaceCanvas: React.FC<Props> = ({ expression, isSpeaking }) => {
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

    const drawFace = (openness: number) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fw = canvas.width * 0.75;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Head
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.ellipse(cx, cy, fw / 2, canvas.height * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      drawEyes(cx, cy, fw);
      drawEyebrows(cx, cy, fw);
      drawMouth(cx, cy, fw, openness);
    };

    const drawEyes = (cx: number, cy: number, fw: number) => {
      ctx.fillStyle = "#007BFF";
      const offset = fw * 0.2;
      const eyeY = cy - fw * 0.08 + eyeOffset;
      const eyeW = fw * 0.1;
      const eyeH = blink ? fw * 0.015 : fw * 0.07;

      [cx - offset, cx + offset].forEach((x) => {
        ctx.beginPath();
        ctx.ellipse(x, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.fill();
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
      ctx.lineWidth = fw * 0.01;
      const y = cy + fw * 0.05;

      if (isSpeaking) {
        ctx.beginPath();
        ctx.ellipse(cx, y, fw * 0.06, openness, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(cx, y, fw * 0.1, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();
      }
    };

    const animate = () => {
      eyeOffset = Math.sin(Date.now() / 500) * 5;
      browOffset = eyeOffset;
      if (Math.random() < 0.002) blink = true;
      setTimeout(() => {
        blink = false;
      }, 200);

      const openness = isSpeaking
        ? Math.abs(Math.sin(Date.now() / 80)) * 20 + 5
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
  }, [expression, isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, backgroundColor: "#111" }}
    />
  );
};

export default FaceCanvas;
