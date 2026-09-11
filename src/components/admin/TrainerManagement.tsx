import React, { useState, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import { Trainer } from '../../types';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Instagram,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Loader2,
  Database,
  Cloud
} from 'lucide-react';

export const TrainerManagement: React.FC = () => {
  const { trainers, members, addTrainer, updateTrainer, deleteTrainer, isFirebaseConnected } = useGym();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTrainer, setActiveTrainer] = useState<Trainer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const addFileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingAdd, setIsDraggingAdd] = useState(false);
  const [isDraggingEdit, setIsDraggingEdit] = useState(false);

  const processImageFile = (file: File, callback: (photoDataUrl: string) => void) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.88);
            callback(optimized);
          }
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const [formData, setFormData] = useState({
    name: '',
    role: 'Senior Strength & Hypertrophy Coach',
    specialization: 'Hypertrophy, Powerlifting, Injury Rehab',
    experienceYears: 6,
    certifications: 'CSCS, K11 Certified, CPR/AED',
    bio: 'Dedicated strength coach specialized in progressive overload and functional bodybuilding.',
    photoUrl: '',
    phone: '9845019800',
    instagram: '@bsf_trainer'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      role: 'Head Strength Coach',
      specialization: 'Hypertrophy, Functional Training, Nutrition',
      experienceYears: 5,
      certifications: 'K11 Master Trainer, ACE Certified',
      bio: 'Committed to empowering athletes through scientific biomechanics and tailored nutrition.',
      photoUrl: '',
      phone: '9845019800',
      instagram: '@coach_bsf'
    });
    setIsAddModalOpen(true);
  };

  const defaultTrainerPhoto = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80';

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addTrainer({
        name: formData.name,
        role: formData.role,
        specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean),
        experienceYears: Number(formData.experienceYears) || 1,
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(Boolean),
        bio: formData.bio,
        photoUrl: formData.photoUrl || defaultTrainerPhoto,
        rating: 4.9,
        active: true,
        phone: formData.phone,
        instagram: formData.instagram
      });
      setIsAddModalOpen(false);
      setSaveNotice(`Coach "${formData.name}" added and saved to database.`);
      setTimeout(() => setSaveNotice(null), 5000);
    } catch (err: any) {
      console.error('Error adding trainer:', err);
      alert('Failed to save to database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (trainer: Trainer) => {
    setActiveTrainer(trainer);
    setFormData({
      name: trainer.name,
      role: trainer.role,
      specialization: trainer.specialization.join(', '),
      experienceYears: trainer.experienceYears,
      certifications: trainer.certifications.join(', '),
      bio: trainer.bio,
      photoUrl: trainer.photoUrl,
      phone: trainer.phone,
      instagram: trainer.instagram || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrainer) return;
    setIsSubmitting(true);

    try {
      await updateTrainer(activeTrainer.id, {
        name: formData.name,
        role: formData.role,
        specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean),
        experienceYears: Number(formData.experienceYears) || 1,
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(Boolean),
        bio: formData.bio,
        photoUrl: formData.photoUrl || activeTrainer.photoUrl || defaultTrainerPhoto,
        phone: formData.phone,
        instagram: formData.instagram
      });
      setIsEditModalOpen(false);
      setSaveNotice(`Coach "${formData.name}" changes saved to database.`);
      setTimeout(() => setSaveNotice(null), 5000);
    } catch (err: any) {
      console.error('Error updating trainer:', err);
      alert('Failed to save changes to database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrainer = async (trainer: Trainer) => {
    if (!confirm(`Are you sure you want to remove trainer "${trainer.name}"? This change will be saved to the database.`)) return;
    try {
      await deleteTrainer(trainer.id);
      setSaveNotice(`Coach "${trainer.name}" removed from database.`);
      setTimeout(() => setSaveNotice(null), 5000);
    } catch (err: any) {
      console.error('Error deleting trainer:', err);
      alert('Failed to delete trainer from database.');
    }
  };

  return (
    <div className="space-y-6" id="bsf-admin-trainer-management">
      
      {/* Save Notification Toast Banner */}
      {saveNotice && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveNotice}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
            Database Updated
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white font-display tracking-wide flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-400" />
              TRAINERS & COACHES ROSTER ({trainers.length})
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
              isFirebaseConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Database className="w-3 h-3" />
              {isFirebaseConnected ? 'Cloud DB Connected' : 'Local / Offline DB'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans-body mt-1">
            Certified fitness coaches, biomechanics specialists, and personal training assignments saved to database.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Trainer Cards Grid */}
      {trainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map(t => {
            const assignedCount = members.filter(m => m.assignedTrainerId === t.id).length;
            return (
              <div
                key={t.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-400/40 transition shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative h-56 overflow-hidden bg-zinc-950">
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40" />

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full border border-orange-400/30 text-orange-400 text-xs font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-orange-400" />
                      <span>{t.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-black text-white font-display leading-tight">{t.name}</h3>
                      <p className="text-xs text-orange-400 font-medium">{t.role}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-4 text-xs font-sans-body">
                    <p className="text-zinc-300 line-clamp-2 leading-relaxed">{t.bio}</p>

                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Specializations</span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.specialization.map(spec => (
                          <span key={spec} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md text-[11px]">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Certifications & Experience</span>
                      <div className="flex items-center gap-3 text-zinc-300">
                        <span className="text-orange-400 font-bold font-mono">{t.experienceYears} Years Exp</span>
                        <span>•</span>
                        <span className="truncate text-zinc-400">{t.certifications.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-sky-400" /> Assigned Athletes
                      </span>
                      <span className="text-sm font-bold font-mono text-white">{assignedCount} Members</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between">
                  <a
                    href={`tel:${t.phone}`}
                    className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t.phone}</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrainer(t)}
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete Trainer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-orange-400/10 border border-orange-400/20 text-orange-400 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white font-display uppercase">No Trainers on Roster</h3>
          <p className="text-xs text-zinc-400 font-sans-body leading-relaxed">
            All trainer profiles have been cleared. Click below to add certified coaches, personal trainers, and floor instructors.
          </p>
          <div className="pt-2">
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 mx-auto shadow-lg shadow-orange-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Trainer</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Trainer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">ADD NEW COACH / TRAINER</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Trainer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Certifications (comma separated)</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div id="trainer-photo-upload-section-add" className="space-y-1.5">
                <label className="block font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Trainer Photo (Upload File)
                </label>

                {formData.photoUrl ? (
                  <div className="flex items-center gap-3.5 p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-400/50 bg-black shrink-0">
                      <img
                        src={formData.photoUrl}
                        alt="Trainer preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Photo attached</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Image processed and ready to be saved with profile.
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          id="btn-change-trainer-photo-add"
                          onClick={() => addFileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5"
                        >
                          <Upload className="w-3 h-3 text-orange-400" />
                          <span>Change File</span>
                        </button>
                        <button
                          type="button"
                          id="btn-remove-trainer-photo-add"
                          onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                          className="px-2 py-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 text-[11px] font-semibold rounded-lg transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    id="dropzone-trainer-photo-add"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingAdd(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingAdd(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingAdd(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processImageFile(file, (url) => setFormData(prev => ({ ...prev, photoUrl: url })));
                    }}
                    onClick={() => addFileInputRef.current?.click()}
                    className={`p-5 border-2 border-dashed rounded-2xl cursor-pointer transition flex flex-col items-center justify-center text-center gap-2 group ${
                      isDraggingAdd
                        ? 'border-orange-400 bg-orange-400/10'
                        : 'border-zinc-800 hover:border-orange-400/50 bg-zinc-950/60 hover:bg-zinc-950'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-orange-400/40 text-orange-400 flex items-center justify-center transition shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-orange-300 transition">
                        Click to select photo file or drag & drop here
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        JPEG, PNG, WEBP files supported (auto-optimized)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={addFileInputRef}
                  id="trainer-file-input-add"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processImageFile(file, (url) => setFormData(prev => ({ ...prev, photoUrl: url })));
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Trainer Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 disabled:opacity-50 text-black font-extrabold rounded-xl transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-400/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register Coach & Save to Database</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainer Modal */}
      {isEditModalOpen && activeTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">EDIT COACH: {activeTrainer.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Trainer Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Specializations</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div id="trainer-photo-upload-section-edit" className="space-y-1.5">
                <label className="block font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Trainer Photo (Upload File)
                </label>

                {formData.photoUrl ? (
                  <div className="flex items-center gap-3.5 p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-400/50 bg-black shrink-0">
                      <img
                        src={formData.photoUrl}
                        alt="Trainer preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Photo attached</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Image ready to be updated on coach profile.
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          id="btn-change-trainer-photo-edit"
                          onClick={() => editFileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5"
                        >
                          <Upload className="w-3 h-3 text-orange-400" />
                          <span>Change File</span>
                        </button>
                        <button
                          type="button"
                          id="btn-remove-trainer-photo-edit"
                          onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                          className="px-2 py-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 text-[11px] font-semibold rounded-lg transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    id="dropzone-trainer-photo-edit"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingEdit(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingEdit(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingEdit(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processImageFile(file, (url) => setFormData(prev => ({ ...prev, photoUrl: url })));
                    }}
                    onClick={() => editFileInputRef.current?.click()}
                    className={`p-5 border-2 border-dashed rounded-2xl cursor-pointer transition flex flex-col items-center justify-center text-center gap-2 group ${
                      isDraggingEdit
                        ? 'border-orange-400 bg-orange-400/10'
                        : 'border-zinc-800 hover:border-orange-400/50 bg-zinc-950/60 hover:bg-zinc-950'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-orange-400/40 text-orange-400 flex items-center justify-center transition shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-orange-300 transition">
                        Click to select photo file or drag & drop here
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        JPEG, PNG, WEBP files supported (auto-optimized)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={editFileInputRef}
                  id="trainer-file-input-edit"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processImageFile(file, (url) => setFormData(prev => ({ ...prev, photoUrl: url })));
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 disabled:opacity-50 text-black font-extrabold rounded-xl transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-400/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Saving Changes to Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes to Database</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
