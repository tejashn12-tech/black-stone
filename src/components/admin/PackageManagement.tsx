import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { MembershipPackage } from '../../types';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Zap,
  Tag,
  Star
} from 'lucide-react';

export const PackageManagement: React.FC = () => {
  const { packages, members, addPackage, updatePackage, deletePackage } = useGym();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activePkg, setActivePkg] = useState<MembershipPackage | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    durationMonths: 12,
    price: 15999,
    originalPrice: 22000,
    description: 'Comprehensive annual training membership with unrestricted access.',
    features: 'Unrestricted Gym & Turf Access\nFree Diet & Nutrition Counseling\nQuarterly InBody Composition Assessment\nSteam & Locker Access\n2 Free Guest Workout Passes',
    popular: false,
    badge: 'Best Value'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      durationMonths: 6,
      price: 9999,
      originalPrice: 14000,
      description: '6-Month targeted strength transformation membership.',
      features: 'Unrestricted Floor Access\n1 Free Personal Training Orientation\nLocker & Shower Access',
      popular: false,
      badge: 'Popular'
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addPackage({
      name: formData.name,
      durationMonths: formData.durationMonths,
      price: formData.price,
      originalPrice: formData.originalPrice,
      description: formData.description,
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      popular: formData.popular,
      active: true,
      badge: formData.badge
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (pkg: MembershipPackage) => {
    setActivePkg(pkg);
    setFormData({
      name: pkg.name,
      durationMonths: pkg.durationMonths,
      price: pkg.price,
      originalPrice: pkg.originalPrice || pkg.price,
      description: pkg.description,
      features: pkg.features.join('\n'),
      popular: !!pkg.popular,
      badge: pkg.badge || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePkg) return;

    updatePackage(activePkg.id, {
      name: formData.name,
      durationMonths: formData.durationMonths,
      price: formData.price,
      originalPrice: formData.originalPrice,
      description: formData.description,
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      popular: formData.popular,
      badge: formData.badge
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6" id="bsf-admin-package-management">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-display tracking-wide flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-400" />
            MEMBERSHIP PLANS & PRICING ({packages.length})
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body">
            Configure subscription tiers, discount offers, inclusions, and self-renewal portal plans.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Pricing Cards Grid */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => {
            const subscriberCount = members.filter(m => m.packageId === pkg.id).length;
            const monthlyEquiv = Math.round(pkg.price / (pkg.durationMonths || 1));

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 transition shadow-2xl flex flex-col justify-between ${
                  pkg.popular
                    ? 'bg-zinc-900 border-2 border-orange-400'
                    : 'bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h3 className="text-lg font-black text-white font-display uppercase">{pkg.name}</h3>
                    <span className="text-xs font-mono text-zinc-400 font-bold">{pkg.durationMonths} Mo</span>
                  </div>

                  <div className="my-5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-3xl sm:text-4xl text-white">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-xs font-mono text-zinc-500 line-through">
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-orange-400 font-mono mt-1 font-bold">
                      ≈ ₹{monthlyEquiv.toLocaleString('en-IN')} / month
                    </p>
                    <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-sans-body">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 py-4 border-t border-zinc-800/80 text-xs font-sans-body">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                    {subscriberCount} Active Members
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete plan ${pkg.name}?`)) deletePackage(pkg.id);
                      }}
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete Plan"
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
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white font-display uppercase">No Membership Plans</h3>
          <p className="text-xs text-zinc-400 font-sans-body leading-relaxed">
            All plans have been cleared. Click below to configure membership plans and pricing packages for Black Stone Fitness.
          </p>
          <div className="pt-2">
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 mx-auto shadow-lg shadow-orange-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Membership Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Plan Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">CREATE MEMBERSHIP PLAN</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Year Elite Gold"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Duration (Months) *</label>
                  <input
                    type="number"
                    required
                    value={formData.durationMonths}
                    onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Offer Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Original Price (INR)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Features / Inclusions (1 per line)</label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={e => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Promo Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, 40% Off"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={e => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 text-orange-400 rounded bg-zinc-950 border-zinc-800"
                    />
                    <span className="font-semibold text-white">Highlight as Most Popular</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider"
              >
                Save & Publish Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {isEditModalOpen && activePkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">EDIT PLAN: {activePkg.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Offer Price (INR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Features (1 per line)</label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={e => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Promo Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={e => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 text-orange-400 rounded bg-zinc-950 border-zinc-800"
                    />
                    <span className="font-semibold text-white">Most Popular</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
