import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, User, RefreshCw, Eye } from 'lucide-react';
import { LiveCameraModal } from './LiveCameraModal';
import { compressImageToDataUrl } from '../../utils/photoStorage';

interface MemberPhotoPickerProps {
  photoUrl?: string;
  onChange: (photoUrl?: string) => void;
  memberName?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MemberPhotoPicker: React.FC<MemberPhotoPickerProps> = ({
  photoUrl,
  onChange,
  memberName = 'Member',
  label = 'Athlete ID Photo',
  size = 'md'
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCapture = (newPhotoDataUrl: string) => {
    onChange(newPhotoDataUrl);
    setIsCameraOpen(false);
  };

  const handleRemovePhoto = () => {
    onChange(undefined);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImageToDataUrl(file, 500, 0.82);
        onChange(compressedDataUrl);
      } catch (err) {
        console.error('Failed to compress uploaded photo:', err);
      } finally {
        e.target.value = '';
      }
    }
  };

  const getInitials = () => {
    return memberName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'M';
  };

  return (
    <div className="space-y-1.5" id="member-photo-picker">
      {label && (
        <label className="block font-semibold text-zinc-400 uppercase text-[11px] tracking-wider">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
        {/* Photo Avatar / Frame */}
        <div className="relative group shrink-0">
          <div
            className={`rounded-2xl overflow-hidden border-2 flex items-center justify-center transition shadow-lg ${
              photoUrl
                ? 'border-orange-400/80 bg-black'
                : 'border-dashed border-zinc-700 bg-zinc-900 text-zinc-400'
            } ${
              size === 'sm'
                ? 'w-14 h-14'
                : size === 'lg'
                ? 'w-24 h-24'
                : 'w-20 h-20'
            }`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={memberName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500">
                <span className="font-mono font-extrabold text-sm text-zinc-400">
                  {getInitials()}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-600 mt-0.5">
                  No Photo
                </span>
              </div>
            )}
          </div>

          {/* Quick Overlay Action on Hover */}
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[1px]"
            title="Open Live Camera"
          >
            <Camera className="w-5 h-5 text-orange-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Camera</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-orange-400/20 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{photoUrl ? 'Retake Live Photo' : 'Take Live Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl transition border border-zinc-800 flex items-center gap-1.5"
              title="Upload existing image from file"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>Upload</span>
            </button>

            {photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-zinc-500 font-sans-body">
            {photoUrl
              ? '🟢 High-resolution live ID snapshot attached.'
              : '📷 Click "Take Live Photo" to capture live webcam portrait of the athlete.'}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Live Camera Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
        title="Live Athlete Photo Capture"
        subtitle="Position the member in front of the camera and snap"
        currentPhotoUrl={photoUrl}
        memberName={memberName}
      />
    </div>
  );
};
