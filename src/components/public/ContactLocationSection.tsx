import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const ContactLocationSection: React.FC = () => {
  const { addEnquiry, settings } = useGym();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: '',
    fitnessGoal: 'General Fitness'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEnquiry({
      name: form.name,
      phone: form.phone,
      whatsapp: form.phone,
      gender: 'Other',
      fitnessGoal: form.fitnessGoal,
      referralSource: 'Google',
      notes: `Website Contact Form Message: ${form.message}`,
      status: 'New Lead'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', message: '', fitnessGoal: 'General Fitness' });
    }, 3000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="contact">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
          VISIT BLACK STONE FITNESS • MYSURU
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          LOCATE THE FACILITY & CONNECT
        </h2>
        <p className="text-sm text-zinc-400 font-sans-body">
          Conveniently located in Mysuru with ample valet parking, wide road access, and continuous coaching floor supervision.
        </p>
      </div>

      {/* Grid: Info & Map + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Info & Map (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Address */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-orange-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base font-display">FACILITY ADDRESS</h4>
              <p className="text-xs text-zinc-300 font-sans-body leading-relaxed">
                52/4 New, New Kantharaj Urs Rd, Near Sharadadevi Nagar, <br />
                Basaveshwaranagar, Sharadadevi Nagar, Mysuru, Karnataka 570023
              </p>
              <a
                href="https://maps.google.com/?q=52/4+new,+New+Kantharaj+Urs+Rd,+near+sharadadevi+nagar,+Basaveshwaranagar,+Sharadadevi+Nagar,+Mysuru,+Karnataka+570023"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold pt-1"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base font-display">TRAINING HOURS</h4>
              <div className="text-xs text-zinc-300 font-sans-body space-y-1">
                <p><strong className="text-white">Mon – Sat:</strong> 5:30 AM – 10:00 PM</p>
                <p><strong className="text-white">Sunday:</strong> 6:00 AM – 1:00 PM</p>
                <p className="text-orange-400 font-mono text-[11px] pt-0.5">Floor Coaches on Duty All Day</p>
              </div>
            </div>

          </div>

          {/* Quick WhatsApp & Call Badges */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-white text-sm">Need Instant Assistance?</h4>
              <p className="text-xs text-zinc-400">Speak directly with our Mysuru front-desk concierge.</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/91${(settings.whatsapp || '9880397294').replace(/\D/g, '').slice(-10)}?text=Hi%20Black%20Stone%20Fitness%20Mysuru,%20I%20would%20like%20to%20enquire%20about%20gym%20membership.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition border border-zinc-700 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Call Front Desk</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative rounded-3xl overflow-hidden h-60 bg-zinc-950 border border-zinc-800">
            <iframe
              title="Black Stone Fitness Location Mysuru"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124741.05615707767!2d76.56564881078726!3d12.311827471926618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf70381d572ef9%3A0x2b89e8c27768f51a!2sMysuru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-80"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 px-3 py-1 bg-zinc-950/90 border border-zinc-700 rounded-lg text-[10px] font-mono text-orange-400 font-bold flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>BSF MYSURU • NEW KANTHARAJ URS RD, SHARADADEVI NAGAR</span>
            </div>
          </div>

        </div>

        {/* Contact / Quick Enquiry Form (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-white font-display tracking-wide">
              REQUEST A CALLBACK / ENQUIRY
            </h3>
            <p className="text-xs text-zinc-400 font-sans-body mt-1">
              Leave your contact details and our head fitness consultant will provide custom membership options.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Enquiry Logged Successfully!</h4>
              <p className="text-xs text-zinc-400 font-sans-body max-w-xs mx-auto">
                Thank you! Our Mysuru team will WhatsApp or call you within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-body">
              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Darshan Gowda"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">Primary Fitness Goal</label>
                <select
                  value={form.fitnessGoal}
                  onChange={e => setForm({ ...form, fitnessGoal: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                >
                  <option>Muscle Hypertrophy & Strength</option>
                  <option>Weight Loss & Body Fat Reduction</option>
                  <option>Personal Coaching / 1-on-1 Training</option>
                  <option>General Athletic Conditioning</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">Questions / Preferred Timings</label>
                <textarea
                  rows={3}
                  placeholder="Ask about batch timings, personal training, student discounts, etc."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider shadow-lg shadow-orange-400/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enquiry to Front Desk</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </section>
  );
};
