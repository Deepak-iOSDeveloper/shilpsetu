import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper';
import { ChevronLeft, User, Phone, Mail, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const SignUpBasic: React.FC = () => {
  const { activeRole, setActiveRole, setCurrentView, onboardingData, updateOnboardingData, signUpWithEmail } = useApp();
  const [name, setName] = useState(onboardingData.name || '');
  const [phone, setPhone] = useState(onboardingData.phone || '');
  const [email, setEmail] = useState(onboardingData.email || '');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    setShowOtpModal(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '1234' || otpCode.length === 4) {
      setOtpVerified(true);
      setShowOtpModal(false);
    } else {
      alert("Invalid OTP! Try entering 1234.");
    }
  };

  const handleNext = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!otpVerified) {
      alert("Please complete the Phone verification with OTP first.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      alert("Please enter a password of at least 6 characters.");
      return;
    }
    
    updateOnboardingData({ name, phone, email });
    await signUpWithEmail(email, password, name, phone, activeRole || 'ARTISAN');
    setCurrentView('login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-brandbg relative">
      
      {/* Background textile graphic divider */}
      <div className="absolute top-0 left-0 right-0 textile-pattern-divider opacity-10" />

      {/* Header with Back Chevron */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setActiveRole(null)}
            className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="w-24">
            <Stepper currentStep={1} totalSteps={4} />
          </div>
        </div>

        <div className="mt-6 mb-6">
          <h2 className="text-2xl font-bold font-heading text-text-primary">Let's get started</h2>
          <p className="text-sm text-text-secondary mt-1">Create your profile to join the ShilpSetu community</p>
        </div>

        {/* Input fields as white rounded-2xl cards with icons */}
        <form className="flex flex-col gap-4">
          {/* Name Field */}
          <div className="bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <User className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 pr-3">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full text-sm font-bold text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Phone Field with Get OTP */}
          <div className="bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-3">
            <div className="w-11 h-11 bg-secondary/15 rounded-xl flex items-center justify-center text-secondary-dark shrink-0">
              <Phone className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Mobile Number</label>
              <div className="flex items-center">
                <span className="text-sm font-bold text-text-primary mr-1 shrink-0">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  maxLength={10}
                  className="w-full text-sm font-bold text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent"
                  disabled={otpVerified}
                />
              </div>
            </div>
            <div className="pr-1.5 shrink-0">
              {otpVerified ? (
                <div className="flex items-center gap-1 text-accent text-xs font-bold bg-accent/10 px-2.5 py-1.5 rounded-lg border border-accent/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-dark shadow-sm transition-all"
                >
                  {otpSent ? 'Resend' : 'Get OTP'}
                </button>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-3">
            <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
              <Mail className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 pr-3">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@brand.com"
                className="w-full text-sm font-bold text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FF6B35]/15 rounded-xl flex items-center justify-center text-[#FF6B35] shrink-0">
              <Lock className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 pr-3">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Password * (Min 6 chars)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm font-bold text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>
        </form>
      </div>

      {/* Button CTA */}
      <div className="w-full max-w-sm mx-auto mt-8">
        <Button 
          onClick={handleNext}
          showArrow={true}
          className={!otpVerified || !name ? 'opacity-65' : ''}
        >
          Next
        </Button>
      </div>

      {/* Mock OTP Verification Dialog Modal */}
      {showOtpModal && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-primary/5 flex flex-col gap-4 text-center">
            <div className="w-12 h-12 bg-secondary/15 rounded-full flex items-center justify-center text-secondary-dark mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-text-primary">Enter Verification Code</h3>
              <p className="text-xs text-text-secondary mt-1">
                We sent a 4-digit code to +91 {phone || '98765 43210'}. Enter <span className="font-bold text-primary">1234</span> to verify.
              </p>
            </div>
            <input
              type="text"
              maxLength={4}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-28 text-center text-xl font-bold tracking-widest py-2 bg-stone-50 border border-stone-200 rounded-xl mx-auto focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-3 text-xs font-bold text-text-secondary border border-stone-200 rounded-xl hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-3 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-dark"
              >
                Verify Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative footer textile motif */}
      <div className="w-full text-center mt-6 opacity-30 text-[10px] font-medium text-text-secondary tracking-widest uppercase">
        🇮🇳 Handcrafted with pride
      </div>

    </div>
  );
};
