import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEye,
  faEyeSlash,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { Input, Button, Checkbox } from '../../shared/ui/index.js';
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isNonEmpty,
} from '../../shared/utils/validators.js';
import AuthVisualSide from './components/AuthVisualSide.jsx';
import AuthTopBar from './components/AuthTopBar.jsx';
import AuthRoleSelector from './components/AuthRoleSelector.jsx';

export default function CreateAccountPage() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const updateField = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!isNonEmpty(formData.fullName)) {
      newErrors.fullName = t('auth.errors.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('auth.errors.required');
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = t('auth.errors.invalidPhone');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (!isValidPassword(formData.password, 8)) {
      newErrors.password = t('auth.errors.passwordMin');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch');
    }

    if (!formData.terms) {
      newErrors.terms = t('auth.errors.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    // Mock secure signup handshake (safe demo, no storage of sensitive data)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-brand-navy/95 p-3 sm:p-6 lg:p-8 flex items-center justify-center font-body selection:bg-brand-yellow selection:text-brand-navy"
    >
      {/* Outer Split-Screen Card */}
      <div className="w-full max-w-[1340px] min-h-[680px] max-h-[960px] my-auto bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] border border-brand-navy/15">
        
        {/* Branded Visual Storytelling Side */}
        <AuthVisualSide mode="signup" />

        {/* Interactive Signup Form Side */}
        <section className="relative flex flex-col justify-between p-5 sm:p-6 lg:p-7 xl:p-8 overflow-y-auto bg-surface-white">
          <div className="w-full max-w-md mx-auto">
            {/* Top Navigation & Language */}
            <AuthTopBar />

            {/* Header Titles */}
            <div className="mb-4">
              <span className="inline-block px-3 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs mb-1.5">
                {role === 'customer'
                  ? t('auth.roles.customerBadge')
                  : t('auth.roles.partnerBadge')}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight leading-tight mb-1">
                {t('auth.signup.title')}
              </h2>

              <p className="text-brand-navy/60 text-xs sm:text-sm leading-relaxed">
                {t('auth.signup.subtitle')}
              </p>
            </div>

            {/* 2-Role Selector (Customer vs Partner per SRS §7.3) */}
            <AuthRoleSelector role={role} onChange={setRole} />

            {/* Success Feedback */}
            {success && (
              <div
                role="status"
                className="mb-4 p-3.5 rounded-2xl bg-surface-mist border border-brand-blue/30 flex items-start gap-3 animate-fadeIn"
              >
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-brand-blue text-lg shrink-0 mt-0.5"
                />
                <p className="text-brand-navy text-xs sm:text-sm font-semibold leading-relaxed">
                  {t('auth.signup.successMessage')}
                </p>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-2.5 sm:space-y-3">
              {/* Full Name */}
              <Input
                label={t('auth.signup.fullName')}
                id="signup-name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={updateField}
                placeholder={t('auth.signup.fullNamePlaceholder')}
                required
                error={errors.fullName}
                autoComplete="name"
              />

              {/* Email */}
              <Input
                label={t('auth.signup.email')}
                id="signup-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={updateField}
                placeholder={t('auth.signup.emailPlaceholder')}
                required
                error={errors.email}
                autoComplete="email"
                dir={formData.email ? 'ltr' : undefined}
              />

              {/* Phone */}
              <Input
                label={t('auth.signup.phone')}
                id="signup-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={updateField}
                placeholder={t('auth.signup.phonePlaceholder')}
                required
                error={errors.phone}
                autoComplete="tel"
                dir={formData.phone ? 'ltr' : undefined}
              />

              {/* Password */}
              <Input
                label={t('auth.signup.password')}
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={updateField}
                placeholder={t('auth.signup.passwordPlaceholder')}
                required
                error={errors.password}
                autoComplete="new-password"
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

              {/* Confirm Password */}
              <Input
                label={t('auth.signup.confirmPassword')}
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={updateField}
                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                required
                error={errors.confirmPassword}
                autoComplete="new-password"
                dir={formData.confirmPassword ? 'ltr' : undefined}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? t('auth.signup.hidePassword')
                        : t('auth.signup.showPassword')
                    }
                    className="text-brand-navy/45 hover:text-brand-blue transition-colors cursor-pointer p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      className="text-sm"
                    />
                  </button>
                }
              />

              {/* Terms & Conditions Checkbox */}
              <div className="pt-1.5">
                <Checkbox
                  id="signup-terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={updateField}
                  label={t('auth.signup.terms')}
                  error={errors.terms}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
                className="mt-3 font-black shadow-md hover:shadow-lg transition-all"
                icon={
                  isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faUserPlus} />
                  )
                }
              >
                {isSubmitting
                  ? t('auth.common.submitting')
                  : t('auth.signup.submit')}
              </Button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 pt-5 border-t border-brand-navy/10 text-center">
              <p className="text-xs sm:text-sm text-brand-navy/70">
                {t('auth.signup.alreadyHaveAccount')}{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-bold text-brand-blue hover:text-brand-navy hover:underline transition-colors ms-1"
                >
                  {t('auth.signup.login')}
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Security / Privacy Note */}
          <div className="mt-6 pt-3 border-t border-brand-navy/5 text-center text-[11px] text-brand-navy/40">
            {t('auth.common.demoNotice')}
          </div>
        </section>
      </div>
    </div>
  );
}
