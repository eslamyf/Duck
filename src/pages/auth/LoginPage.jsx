import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightToBracket,
  faEye,
  faEyeSlash,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { Input, Button, Checkbox } from '../../shared/ui/index.js';
import { isValidEmail } from '../../shared/utils/validators.js';
import AuthVisualSide from './components/AuthVisualSide.jsx';
import AuthTopBar from './components/AuthTopBar.jsx';
import AuthRoleSelector from './components/AuthRoleSelector.jsx';

export default function LoginPage() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setSuccess(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    // Mock secure authentication handshake (safe demo, no storage of sensitive data)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-brand-navy/95 p-3 sm:p-6 lg:p-8 flex items-center justify-center font-body selection:bg-brand-yellow selection:text-brand-navy"
    >
      {/* Outer Card Container */}
      <div className="w-full max-w-[1340px] min-h-[640px] max-h-[920px] bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] border border-brand-navy/15">
        
        {/* Visual Storytelling Side */}
        <AuthVisualSide mode="login" />

        {/* Form Interactive Side */}
        <section className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto bg-surface-white">
          <div className="w-full max-w-md mx-auto">
            {/* Top Navigation & Language */}
            <AuthTopBar />

            {/* Header Titles */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs mb-3">
                {role === 'customer'
                  ? t('auth.roles.customerBadge')
                  : t('auth.roles.partnerBadge')}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy tracking-tight leading-tight mb-2">
                {t('auth.login.title')}
              </h2>

              <p className="text-brand-navy/60 text-sm leading-relaxed">
                {t('auth.login.subtitle')}
              </p>
            </div>

            {/* 2-Role Selector (Customer vs Partner per SRS §7.3) */}
            <AuthRoleSelector role={role} onChange={setRole} />

            {/* Success Feedback */}
            {success && (
              <div
                role="status"
                className="mb-6 p-4 rounded-2xl bg-surface-mist border border-brand-blue/30 flex items-start gap-3 animate-fadeIn"
              >
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-brand-blue text-lg shrink-0 mt-0.5"
                />
                <p className="text-brand-navy text-xs sm:text-sm font-semibold leading-relaxed">
                  {t('auth.login.successMessage')}
                </p>
              </div>
            )}

            {/* Forgot Password Help Box */}
            {showForgotNotice && (
              <div
                role="region"
                aria-label="Password Reset Help"
                className="mb-6 p-4 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/50 flex flex-col gap-2"
              >
                <p className="text-xs sm:text-sm font-bold text-brand-navy">
                  {t('auth.login.forgotPasswordNotice')}
                </p>
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy bg-brand-yellow hover:bg-brand-yellow-hover px-3 py-1.5 rounded-xl w-fit transition-all shadow-sm"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                  <span>{t('tripDetails.bookViaWhatsApp')}</span>
                </a>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <Input
                label={t('auth.login.email')}
                id="login-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={updateField}
                placeholder={t('auth.login.emailPlaceholder')}
                required
                error={errors.email}
                autoComplete="email"
                dir={formData.email ? 'ltr' : undefined}
              />

              {/* Password */}
              <div>
                <Input
                  label={t('auth.login.password')}
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={updateField}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  required
                  error={errors.password}
                  autoComplete="current-password"
                  dir={formData.password ? 'ltr' : undefined}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? t('auth.signup.hidePassword')
                          : t('auth.signup.showPassword')
                      }
                      className="text-brand-navy/45 hover:text-brand-blue transition-colors cursor-pointer p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="text-sm"
                      />
                    </button>
                  }
                />

                <div className="flex items-center justify-between mt-2.5">
                  <Checkbox
                    id="login-remember"
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    label={t('auth.login.rememberMe')}
                  />

                  <button
                    type="button"
                    onClick={() => setShowForgotNotice((prev) => !prev)}
                    className="text-xs font-bold text-brand-blue hover:text-brand-navy transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:underline"
                  >
                    {t('auth.login.forgotPassword')}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
                className="mt-4 font-black shadow-md hover:shadow-lg transition-all"
                icon={
                  isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faArrowRightToBracket} />
                  )
                }
              >
                {isSubmitting
                  ? t('auth.common.submitting')
                  : t('auth.login.submit')}
              </Button>
            </form>

            {/* Switch to Sign Up */}
            <div className="mt-8 pt-6 border-t border-brand-navy/10 text-center">
              <p className="text-xs sm:text-sm text-brand-navy/70">
                {t('auth.login.noAccount')}{' '}
                <Link
                  to={ROUTES.SIGNUP}
                  className="font-bold text-brand-blue hover:text-brand-navy hover:underline transition-colors ms-1"
                >
                  {t('auth.login.signup')}
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Security / Privacy Note */}
          <div className="mt-8 pt-4 border-t border-brand-navy/5 text-center text-[11px] text-brand-navy/40">
            {t('auth.common.demoNotice')}
          </div>
        </section>
      </div>
    </div>
  );
}
