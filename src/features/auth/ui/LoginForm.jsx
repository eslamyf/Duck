import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightToBracket,
  faEye,
  faEyeSlash,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';
import { ROUTES } from '../../../shared/config/routes.js';
import { Input, Button, Checkbox } from '../../../shared/ui/index.js';
import { isValidEmail } from '../../../shared/utils/validators.js';
import AuthRoleSelector from './AuthRoleSelector.jsx';
import AuthHeader from './AuthHeader.jsx';

export default function LoginForm() {
  const { t } = useTranslation();

  const [role, setRole] = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: role === 'Partner' ? 'partner@egyrow.eg' : '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrors({});
    setSuccess(false);
    if (!formData.email || formData.email === 'partner@egyrow.eg' || formData.email === 'ahmed@duck.demo') {
      setFormData((prev) => ({
        ...prev,
        email: newRole === 'Partner' ? 'partner@egyrow.eg' : '',
      }));
    }
  };

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

    // Mock secure auth handshake (safe demo, zero password storage)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full">
      <div>
        {/* Header Navigation & Mobile Branding */}
        <AuthHeader />

        {/* 2-Role Segmented Selector (Final_4.html line 1901) */}
        <AuthRoleSelector role={role} onChange={handleRoleChange} />

        {/* Header Titles */}
        <div className="mb-5 text-start">
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight leading-tight mb-1.5">
            {t('auth.login.title')}
          </h2>
          <p className="text-brand-navy/65 text-xs sm:text-sm leading-relaxed">
            {role === 'Partner'
              ? t('auth.roles.partnerDescLogin')
              : t('auth.roles.customerDescLogin')}
          </p>
        </div>

        {/* Success Feedback */}
        {success && (
          <div
            role="status"
            className="mb-5 p-3.5 rounded-2xl bg-surface-mist border border-brand-blue/30 flex items-start gap-2.5 animate-fadeIn"
          >
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-brand-blue text-base shrink-0 mt-0.5"
            />
            <p className="text-brand-navy text-xs sm:text-sm font-semibold leading-relaxed">
              {t('auth.login.successMessage')}
            </p>
          </div>
        )}

        {/* Forgot Password Notice */}
        {showForgotNotice && (
          <div
            role="region"
            aria-label="Password Reset Assistance"
            className="mb-5 p-3.5 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/50 flex flex-col gap-2"
          >
            <p className="text-xs sm:text-sm font-bold text-brand-navy leading-normal">
              {t('auth.login.forgotPasswordNotice')}
            </p>
            <a
              href="https://wa.me/201550061006"
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
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
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

            <div className="flex items-center justify-between mt-2">
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
                <FontAwesomeIcon icon={faArrowRightToBracket} />
              )
            }
          >
            {isSubmitting
              ? t('auth.common.submitting')
              : t('auth.login.submit')}
          </Button>
        </form>

        {/* Divider (Final_4.html line 1913) */}
        <div className="flex items-center gap-3 my-4">
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
          className="w-full min-h-[46px] rounded-2xl border-2 border-brand-navy/15 bg-white text-brand-navy font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-mist hover:border-brand-blue transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <FontAwesomeIcon icon={faGoogle} className="text-brand-blue text-base" />
          <span>{t('auth.common.continueWithGoogle')}</span>
        </button>



        {/* Teammate's Branded "جديد في DUCK؟" CTA Box */}
        <div className="mt-5 p-3.5 rounded-2xl bg-surface-sand border border-brand-navy/10 text-center">
          <p className="text-xs font-bold text-brand-navy/80 mb-2">
            {t('auth.common.noAccountYet')}
          </p>
          <Link
            to={ROUTES.SIGNUP}
            className="w-full min-h-[42px] flex items-center justify-center gap-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <span>{t('auth.common.createAccountCta')}</span>
          </Link>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="mt-5 pt-3 border-t border-brand-navy/5 text-center text-[11px] text-brand-navy/40">
        {t('auth.common.demoNotice')}
      </div>
    </div>
  );
}
