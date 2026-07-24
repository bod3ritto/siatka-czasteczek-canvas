
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

const COLOR_PRESETS = [
  { name: "Fiolet", value: "#a78bfa" },
  { name: "Błękit", value: "#38bdf8" },
  { name: "Bursztyn", value: "#fbbf24" },
  { name: "Zieleń", value: "#34d399" },
  { name: "Róż", value: "#f472b6" },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#a78bfa");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (distMouse < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 1 - distMouse / 180;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.3 - dist / 400;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return (
    <div className="relative min-h-[calc(100dvh-72px)] w-full overflow-hidden bg-[#09090b]">
      <div className="absolute top-4 inset-x-4 z-10 flex flex-wrap items-center justify-between gap-3 sm:top-6 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <a href="#" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-black/40 px-3.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-text-secondary backdrop-blur-md transition-colors hover:border-accent/40 hover:text-text-primary">
            <ArrowLeft size={16} /> Powrót do projektów
          </a>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-black/40 px-3.5 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md">
          <span className="text-xs text-text-muted">Motyw:</span>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setColor(preset.value)}
              style={{ backgroundColor: preset.value }}
              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-transform hover:scale-125 ${
                color === preset.value
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                  : "opacity-70 hover:opacity-100"
              }`}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 sm:bottom-12 left-1/2 z-10 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 text-center px-4">
        <h1 className="text-xl font-bold text-text-primary sm:text-3xl">
          Siatka Cząsteczek Canvas
        </h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-text-secondary">
          Dynamicznie połączone punkty reagujące na zbliżenie myszy.
        </p>
      </div>

      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
