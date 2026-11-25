import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { loginUser } from '../../../entities/user/api/authService.js';

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [role, setRole] = useState('Customer');
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

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrors({});
    setSuccess(false);

    if (
      !formData.email ||
      formData.email === 'partner@egyrow.eg' ||
      formData.email === 'ahmed@duck.demo'
    ) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: '' }));

    try {
      const authenticatedUser = await loginUser({
        email: formData.email,
        password: formData.password,
        rememberMe,
      });

      setSuccess(true);

      if (authenticatedUser.role === 'Admin') {
        navigate(ROUTES.ADMIN, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.message ||
          'Unable to sign in. Please try again.',
      }));

      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full">
      <div>
        <AuthHeader />

        <AuthRoleSelector
          role={role}
          onChange={handleRoleChange}
        />

        <div className="mb-3 text-start">
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight leading-tight mb-1">
            {t('auth.login.title')}
          </h2>

          <p className="text-brand-navy/65 text-xs sm:text-sm leading-relaxed">
            {role === 'Partner'
              ? t('auth.roles.partnerDescLogin')
              : t('auth.roles.customerDescLogin')}
          </p>
        </div>

        {success && (
          <div
            role="status"
            className="mb-3.5 p-3 rounded-xl bg-surface-mist border border-brand-blue/30 flex items-start gap-2.5 animate-fadeIn"
          >
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-brand-blue text-sm shrink-0 mt-0.5"
            />

            <p className="text-brand-navy text-xs sm:text-sm font-semibold leading-relaxed">
              {t('auth.login.successMessage')}
            </p>
          </div>
        )}

        {errors.submit && (
          <div
            role="alert"
            className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold"
          >
            {errors.submit}
          </div>
        )}

        {showForgotNotice && (
          <div
            role="region"
            aria-label="Password Reset Assistance"
            className="mb-3.5 p-3 rounded-xl bg-brand-yellow/15 border border-brand-yellow/50 flex flex-col gap-2"
          >
            <p className="text-xs font-bold text-brand-navy leading-normal">
              {t('auth.login.forgotPasswordNotice')}
            </p>

            <a
              href="https://wa.me/201550061006"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy bg-brand-yellow hover:bg-brand-yellow-hover px-3 py-1.5 rounded-xl w-fit transition-all shadow-sm"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-sm"
              />

              <span>{t('tripDetails.bookViaWhatsApp')}</span>
            </a>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-2.5"
        >
          <Input
            size="sm"
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

          <div>
            <Input
              size="sm"
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
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? t('auth.signup.hidePassword')
                      : t('auth.signup.showPassword')
                  }
                  className="text-brand-navy/45 hover:text-brand-blue transition-colors cursor-pointer p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={
                      showPassword ? faEyeSlash : faEye
                    }
                    className="text-sm"
                  />
                </button>
              }
            />

            <div className="flex items-center justify-between mt-1.5">
              <Checkbox
                id="login-remember"
                name="remember"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                label={t('auth.login.rememberMe')}
              />

              <button
                type="button"
                onClick={() =>
                  setShowForgotNotice((prev) => !prev)
                }
                className="text-xs font-bold text-brand-blue hover:text-brand-navy transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:underline"
              >
                {t('auth.login.forgotPassword')}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={isSubmitting}
            className="mt-1 font-black shadow-md hover:shadow-lg transition-all min-h-[40px] sm:min-h-[42px] py-2 text-xs sm:text-sm"
            icon={
              isSubmitting ? (
                <div className="w-4 h-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
              ) : (
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="text-xs"
                />
              )
            }
          >
            {isSubmitting
              ? t('auth.common.submitting')
              : t('auth.login.submit')}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-brand-navy/15" />

          <span className="text-brand-navy/45 text-xs font-bold uppercase tracking-wider">
            {t('auth.common.orContinueWith')}
          </span>

          <div className="flex-1 h-px bg-brand-navy/15" />
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSubmitting(true);

            setTimeout(() => {
              setIsSubmitting(false);
              setSuccess(true);
            }, 600);
          }}
          className="w-full min-h-[40px] sm:min-h-[42px] rounded-xl border-2 border-brand-navy/15 bg-white text-brand-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-3 hover:bg-surface-mist hover:border-brand-blue transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <FontAwesomeIcon
            icon={faGoogle}
            className="text-brand-blue text-sm"
          />

          <span>
            {t('auth.common.continueWithGoogle')}
          </span>
        </button>

        <div className="mt-3.5 p-3 rounded-xl bg-surface-sand border border-brand-navy/10 text-center">
          <p className="text-xs font-bold text-brand-navy/80 mb-1.5">
            {t('auth.common.noAccountYet')}
          </p>

          <Link
            to={ROUTES.SIGNUP}
            className="w-full min-h-[38px] sm:min-h-[40px] flex items-center justify-center gap-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <span>
              {t('auth.common.createAccountCta')}
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-brand-navy/5 text-center text-[10px] text-brand-navy/40">
        {t('auth.common.demoNotice')}
      </div>
    </div>
  );
}