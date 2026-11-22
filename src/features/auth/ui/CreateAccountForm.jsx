import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCompass,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';
import { ROUTES } from '../../../shared/config/routes.js';
import { Input, Button, Checkbox } from '../../../shared/ui/index.js';
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isNonEmpty,
} from '../../../shared/utils/validators.js';
import AuthRoleSelector from './AuthRoleSelector.jsx';
import duckLogo from '../../../shared/assets/icons/Artboard 14.png';

export default function CreateAccountForm() {
  const { t } = useTranslation();

  const [role, setRole] = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrors({});
    setSuccess(false);
  };

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

    if (role === 'Partner' && !isNonEmpty(formData.businessName)) {
      newErrors.businessName = t('auth.errors.businessNameRequired');
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

    // Mock secure signup handshake (safe demo, zero password storage)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full">
      <div>
        {/* Mobile Logo & Tagline */}
        <div className="lg:hidden text-center mb-5">
          <Link to={ROUTES.HOME} className="inline-block focus:outline-none mb-2">
            <img
              src={duckLogo}
              alt={t('common.brandName')}
              className="h-8 w-auto object-contain mx-auto"
            />
          </Link>
          <span className="inline-block px-3 py-0.5 rounded-full bg-brand-yellow/30 text-brand-navy font-bold text-xs">
            {t('auth.common.inDuckWeTrust')}
          </span>
        </div>

        {/* 2-Role Segmented Selector (Final_4.html line 1901) */}
        <AuthRoleSelector role={role} onChange={handleRoleChange} />

        {/* Header Titles */}
        <div className="mb-4 text-start">
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight leading-tight mb-1">
            {t('auth.signup.title')}
          </h2>
          <p className="text-brand-navy/65 text-xs sm:text-sm leading-relaxed">
            {role === 'Partner'
              ? t('auth.roles.partnerDescSignup')
              : t('auth.roles.customerDescSignup')}
          </p>
        </div>

        {/* Success Feedback */}
        {success && (
          <div
            role="status"
            className="mb-4 p-3.5 rounded-2xl bg-surface-mist border border-brand-blue/30 flex items-start gap-2.5 animate-fadeIn"
          >
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-brand-blue text-base shrink-0 mt-0.5"
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

          {/* Business / Provider Name (Final_4.html line 1907 - ONLY when role is Partner) */}
          {role === 'Partner' && (
            <Input
              label={t('auth.signup.businessName')}
              id="signup-business"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={updateField}
              placeholder={t('auth.signup.businessNamePlaceholder')}
              required
              error={errors.businessName}
              autoComplete="organization"
            />
          )}

          {/* WhatsApp Phone */}
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
          <div className="pt-1">
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

          {/* Submit Button (Primary Yellow) */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={isSubmitting}
            className="mt-2 font-black shadow-md hover:shadow-lg transition-all"
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

        {/* Divider (Final_4.html line 1913) */}
        <div className="flex items-center gap-3 my-3.5">
          <div className="flex-1 h-px bg-brand-navy/15" />
          <span className="text-brand-navy/45 text-xs font-bold uppercase tracking-wider">
            {t('auth.common.orContinueWith')}
          </span>
          <div className="flex-1 h-px bg-brand-navy/15" />
        </div>

        {/* Google Continue Button (Final_4.html line 1914) */}
        <button
          type="button"
          onClick={() => {
            setIsSubmitting(true);
            setTimeout(() => {
              setIsSubmitting(false);
              setSuccess(true);
            }, 600);
          }}
          className="w-full min-h-[44px] rounded-2xl border-2 border-brand-navy/15 bg-white text-brand-navy font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-mist hover:border-brand-blue transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <FontAwesomeIcon icon={faGoogle} className="text-brand-blue text-base" />
          <span>{t('auth.common.continueWithGoogle')}</span>
        </button>

        {/* Continue as Guest Link */}
        <div className="mt-2.5 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy/70 hover:text-brand-blue transition-colors focus:outline-none focus-visible:underline"
          >
            <FontAwesomeIcon icon={faCompass} className="text-xs text-brand-blue" />
            <span>{t('auth.common.continueAsGuest')}</span>
          </Link>
        </div>

        {/* Switch to Login (Final_4.html line 1915) */}
        <div className="mt-4 pt-3.5 border-t border-brand-navy/10 text-center">
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

      {/* Bottom Footer Note */}
      <div className="mt-4 pt-2 border-t border-brand-navy/5 text-center text-[11px] text-brand-navy/40">
        {t('auth.common.demoNotice')}
      </div>
    </div>
  );
}
