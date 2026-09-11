import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Upload,
  SwitchCamera,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { compressImageToDataUrl } from '../../utils/photoStorage';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
  title?: string;
  subtitle?: string;
  currentPhotoUrl?: string;
  memberName?: string;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Live Member Photo Capture',
  subtitle = 'Align face within the frame and capture a high-resolution ID photo',
  currentPhotoUrl,
  memberName
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Play subtle shutter sound via Web Audio API
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio playback limitations
    }
  };

  // Stop camera tracks
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  // Start live camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setIsLoadingCamera(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser. Please use the file upload option.');
      }

      // Enumerate devices to give switching options
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
        setDevices(videoInputs);
      } catch {
        // Enumerate fallback
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : {
              facingMode,
              width: { ideal: 1280 },
              height: { ideal: 1280 }
            }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access permission was denied. Please allow camera permissions in your browser bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No active camera device found. Please connect a webcam or upload a photo.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is currently in use by another application. Please close other camera apps and retry.');
      } else {
        setCameraError(err.message || 'Unable to access live camera.');
      }
    } finally {
      setIsLoadingCamera(false);
    }
  }, [selectedDeviceId, facingMode, stopCamera]);

  // When modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, selectedDeviceId]);

  // Capture current video frame
  const handleSnap = () => {
    if (!videoRef.current) return;

    setIsFlashing(true);
    playShutterSound();
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;

    // Crop to 1:1 square centered portrait
    const size = Math.min(videoWidth, videoHeight);
    const startX = (videoWidth - size) / 2;
    const startY = (videoHeight - size) / 2;

    const targetDimension = 500; // clean standard square ID size
    canvas.width = targetDimension;
    canvas.height = targetDimension;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If user facing mode, flip horizontally for mirror natural feel
      if (facingMode === 'user') {
        ctx.translate(targetDimension, 0);
        ctx.scale(-1, 1);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(video, startX, startY, size, size, 0, 0, targetDimension, targetDimension);

      // Generate optimized compressed JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  // Trigger countdown timer capture
  const handleTimerSnap = (seconds: number = 3) => {
    setCountdown(seconds);
    let remaining = seconds;
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        clearInterval(interval);
        setCountdown(null);
        handleSnap();
      }
    }, 1000);
  };

  // Handle Retake
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Handle Confirm & Save
  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  // Switch facing mode (Front / Back)
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // File upload fallback
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await compressImageToDataUrl(file, 500, 0.82);
        setCapturedImage(dataUrl);
        stopCamera();
      } catch (err) {
        console.error('Failed to process uploaded photo:', err);
      } finally {
        e.target.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="live-camera-modal-overlay"
    >
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto text-zinc-100"
        id="live-camera-modal-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-400/10 border border-orange-400/30 text-orange-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-tight flex items-center gap-2">
                {title}
              </h3>
              {memberName ? (
                <p className="text-xs text-orange-400 font-bold font-mono">
                  Member: {memberName}
                </p>
              ) : (
                <p className="text-xs text-zinc-400 font-sans-body">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Capture Frame */}
        <div className="relative w-full aspect-square max-h-[380px] bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-inner flex items-center justify-center">
          {/* Shutter Flash Animation */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200 pointer-events-none" />
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="text-7xl font-black text-orange-400 font-mono animate-ping">
                {countdown}
              </span>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500/90 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Photo Captured</span>
              </div>
            </div>
          ) : (
            <>
              {/* Live Video Stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* ID Photo Guide Overlay (Face Outline / Badge Oval) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Oval outline */}
                <div className="w-[68%] h-[78%] rounded-[50%] border-2 border-dashed border-orange-400/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative flex items-center justify-center">
                  <div className="absolute top-3 text-[10px] uppercase font-mono tracking-widest text-orange-300 font-bold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Center Face
                  </div>
                  {/* Subtle alignment crosshair markers */}
                  <div className="w-4 h-0.5 bg-orange-400/40 absolute -left-2" />
                  <div className="w-4 h-0.5 bg-orange-400/40 absolute -right-2" />
                </div>
              </div>

              {/* Live Status indicator */}
              {stream && !cameraError && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 border border-zinc-700/60 rounded-lg text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE CAMERA</span>
                </div>
              )}

              {/* Loading indicator */}
              {isLoadingCamera && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 z-10">
                  <RefreshCw className="w-7 h-7 text-orange-400 animate-spin" />
                  <p className="text-xs text-zinc-300 font-medium">Connecting to live camera...</p>
                </div>
              )}

              {/* Error state */}
              {cameraError && (
                <div className="absolute inset-0 bg-zinc-950/95 p-6 flex flex-col items-center justify-center text-center gap-3 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-rose-300 max-w-xs">{cameraError}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-orange-400 text-black font-extrabold text-xs rounded-xl hover:bg-orange-300 transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Hidden offscreen canvas and file input */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Device Switcher & Quick Tools (Only while active live video) */}
        {!capturedImage && !cameraError && (
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
            {devices.length > 1 ? (
              <div className="flex items-center gap-1.5">
                <SwitchCamera className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-orange-400"
                >
                  <option value="">Default Camera</option>
                  {devices.map((d, i) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[11px] font-medium text-zinc-300 transition flex items-center gap-1.5"
                title="Switch Front/Back Camera"
              >
                <SwitchCamera className="w-3.5 h-3.5 text-orange-400" />
                <span>Flip ({facingMode === 'user' ? 'Front' : 'Back'})</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTimerSnap(3)}
                className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-300 transition flex items-center gap-1"
                title="3-Second Timer Capture"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>3s Timer</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 transition flex items-center gap-1"
                title="Upload image from device storage"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Bottom Action Controls */}
        <div className="pt-2 border-t border-zinc-800 flex items-center gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-zinc-400" />
                <span>Retake Photo</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoadingCamera || !!cameraError}
                onClick={handleSnap}
                className="flex-1 py-3 bg-orange-400 hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo Now</span>
              </button>
            </>
          )}
        </div>

        {/* Current Photo Note if available */}
        {currentPhotoUrl && !capturedImage && (
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
            <span className="text-zinc-400">Current Photo:</span>
            <img
              src={currentPhotoUrl}
              alt="Current"
              className="w-5 h-5 rounded-md object-cover border border-zinc-700"
            />
            <span>Taking a new photo will replace this.</span>
          </div>
        )}
      </div>
    </div>
  );
};
