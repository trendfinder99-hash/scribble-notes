"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/color-picker";
import { INK_COLORS, DEFAULT_INK_COLOR } from "@/lib/colors";

interface DrawPadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (image: string) => void;
  initialImage?: string;
}

interface Point {
  x: number;
  y: number;
}

const PEN_SIZES = [
  { label: "Thin", value: 3 },
  { label: "Medium", value: 7 },
  { label: "Thick", value: 13 },
  { label: "Extra thick", value: 20 },
];

const DEFAULT_PEN_SIZE = 7;

export function DrawPad({ open, onOpenChange, onSave, initialImage }: DrawPadProps) {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const hueRef = useRef(0);
  const [hasInk, setHasInk] = useState(false);
  const [inkColor, setInkColor] = useState(DEFAULT_INK_COLOR);
  const [penSize, setPenSize] = useState(DEFAULT_PEN_SIZE);
  const penSizeRef = useRef(penSize);
  penSizeRef.current = penSize;

  const setupCanvases = useCallback(() => {
    const base = baseCanvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!base || !overlay) return;
    const rect = base.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    for (const canvas of [base, overlay]) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    }

    if (initialImage) {
      const baseCtx = base.getContext("2d");
      const img = new window.Image();
      img.onload = () => {
        baseCtx?.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialImage;
      setHasInk(true);
    } else {
      setHasInk(false);
    }
  }, [initialImage]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(setupCanvases);
      return () => cancelAnimationFrame(id);
    }
  }, [open, setupCanvases]);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const canvas = overlayCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    overlayCanvasRef.current?.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    currentStrokeRef.current = [getPoint(e)];
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    const point = getPoint(e);
    const points = currentStrokeRef.current;
    const last = points[points.length - 1] ?? point;
    points.push(point);

    const size = penSizeRef.current;

    hueRef.current = (hueRef.current + 8) % 360;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.shadowColor = `hsl(${hueRef.current}, 90%, 65%)`;
    ctx.shadowBlur = Math.max(6, size * 1.2);
    ctx.strokeStyle = `hsl(${hueRef.current}, 90%, 55%)`;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function commitStroke() {
    const base = baseCanvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!base || !overlay) return;
    const baseCtx = base.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!baseCtx || !overlayCtx) return;

    const points = currentStrokeRef.current;
    const size = penSizeRef.current;
    if (points.length > 0) {
      baseCtx.lineCap = "round";
      baseCtx.lineJoin = "round";
      baseCtx.lineWidth = size;
      baseCtx.strokeStyle = inkColor;
      baseCtx.fillStyle = inkColor;

      if (points.length === 1) {
        baseCtx.beginPath();
        baseCtx.arc(points[0].x, points[0].y, size / 2, 0, Math.PI * 2);
        baseCtx.fill();
      } else {
        baseCtx.beginPath();
        baseCtx.moveTo(points[0].x, points[0].y);
        for (const p of points.slice(1)) {
          baseCtx.lineTo(p.x, p.y);
        }
        baseCtx.stroke();
      }
      setHasInk(true);
    }

    const rect = overlay.getBoundingClientRect();
    overlayCtx.clearRect(0, 0, rect.width, rect.height);
    currentStrokeRef.current = [];
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    commitStroke();
  }

  function clearCanvas() {
    const base = baseCanvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!base || !overlay) return;
    const rect = base.getBoundingClientRect();
    base.getContext("2d")?.clearRect(0, 0, rect.width, rect.height);
    overlay.getContext("2d")?.clearRect(0, 0, rect.width, rect.height);
    currentStrokeRef.current = [];
    setHasInk(false);
  }

  function handleSave() {
    const base = baseCanvasRef.current;
    if (!base || !hasInk) return;
    onSave(base.toDataURL("image/png"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-[var(--font-hand)] text-2xl">
            Draw your note ✍️
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          The trail glows rainbow while you write — lift your finger and it
          locks into your chosen color.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Size
            </span>
            <div className="flex items-center gap-1">
              {PEN_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setPenSize(s.value)}
                  aria-label={s.label}
                  title={s.label}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition",
                    penSize === s.value
                      ? "border-stone-900 bg-stone-100 dark:border-white dark:bg-stone-700"
                      : "border-transparent hover:bg-stone-100 dark:hover:bg-stone-800"
                  )}
                >
                  <span
                    className="rounded-full bg-stone-700 dark:bg-stone-200"
                    style={{
                      width: Math.min(s.value, 16),
                      height: Math.min(s.value, 16),
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Ink
            </span>
            <ColorPicker
              value={inkColor}
              onChange={setInkColor}
              swatches={INK_COLORS}
              label="Ink color"
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-stone-400/60 bg-white bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0px,rgba(0,0,0,0.03)_1px,transparent_1px,transparent_12px)] shadow-inner dark:border-stone-600 dark:bg-stone-800">
          <canvas ref={baseCanvasRef} className="block h-64 w-full" />
          <canvas
            ref={overlayCanvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: "none" }}
            className="absolute inset-0 h-64 w-full cursor-crosshair"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            <Trash className="h-4 w-4" /> Clear
          </button>

          <button
            onClick={handleSave}
            disabled={!hasInk}
            className={cn(
              "flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:scale-105 active:scale-95 dark:bg-white dark:text-stone-900",
              !hasInk && "cursor-not-allowed opacity-40 hover:scale-100"
            )}
          >
            <Check className="h-4 w-4" /> Save note
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
