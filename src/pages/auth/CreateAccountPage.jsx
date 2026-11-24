import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

import { useTranslation } from '../../shared/i18n/index.js';

import { registerUser } from '../../entities/user/api/authService.js';

import kayakImage from '../../shared/assets/images/trips/botanical-garden-960w.webp';

function CreateAccountPage() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const isArabic = lang === 'ar';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});

  // Update form fields
  const updateField = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setGeneralError('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.signup.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.signup.required');
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = t('auth.signup.invalidEmail');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('auth.signup.required');
    }

    if (!formData.password) {
      newErrors.password = t('auth.signup.required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.signup.passwordMin');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.passwordMismatch');
    }

    if (!formData.terms) {
      newErrors.terms = t('auth.signup.termsRequired');
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Register user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);
    setGeneralError('');

    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Registration is frontend-only for now.
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        setErrors((prev) => ({
          ...prev,
          email: isArabic
            ? 'هذا البريد الإلكتروني مسجل بالفعل.'
            : 'This email is already registered.',
        }));
      } else if (error.message === 'SECURE_CRYPTO_UNAVAILABLE') {
        setGeneralError(
          isArabic
            ? 'المتصفح لا يدعم عملية إنشاء الحساب. استخدم متصفحًا حديثًا.'
            : 'Your browser does not support account creation. Please use a modern browser.'
        );
      } else {
        setGeneralError(
          isArabic
            ? 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.'
            : 'Something went wrong while creating your account. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `
    w-full h-12 px-4
    bg-[#F7F7F4]
    border border-gray-200
    rounded-xl
    text-[#121528]
    placeholder:text-gray-400
    outline-none
    transition-all duration-200
    focus:border-[#067BA1]
    focus:ring-2 focus:ring-[#067BA1]/10
  `;

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative isolate min-h-[calc(100vh-52px)] lg:min-h-[calc(100vh-100px)] flex items-center justify-center p-4 md:p-8 overflow-hidden"
    >
      {/* ASWAN BACKGROUND IMAGE */}

      <img
        src={kayakImage}
        alt="Aswan background"
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />

      {/* BACKGROUND OVERLAY */}

      <div className="absolute inset-0 z-0 bg-[#121528]/45" />

      <div className="relative z-10 w-full max-w-7xl min-h-[720px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[28px] bg-white shadow-2xl">

        {/* IMAGE SIDE */}

        <section className="relative hidden lg:block min-h-full overflow-hidden">

          <img
            src={kayakImage}
            alt={isArabic ? 'مغامرة كاياك على النيل' : 'Kayaking adventure on the Nile'}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#121528] via-[#121528]/45 to-black/10" />

          <div className="absolute top-10 left-10 right-10 flex justify-between items-center">

            <span className="text-[#F5E847] font-black text-3xl tracking-widest">
              DUCK.
            </span>

            <span className="text-white/80 text-sm tracking-widest">
              IN DUCK WE TRUST
            </span>

          </div>

          <div className="absolute bottom-12 left-10 right-10 text-white">

            <div className="w-14 h-1 bg-[#F5E847] rounded-full mb-6" />

            <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-5">
              {isArabic
                ? 'مغامرتك القادمة تبدأ من هنا.'
                : 'Your Next Adventure Starts Here.'}
            </h2>

            <p className="text-white/75 text-lg leading-8 max-w-md">
              {isArabic
                ? 'اكتشف جمال المياه، واستمتع بتجارب استثنائية مع DUCK.'
                : 'Discover the beauty of the water and enjoy extraordinary experiences with DUCK.'}
            </p>

            <div className="flex items-center gap-3 mt-9">

              <span className="w-2 h-2 rounded-full bg-[#F5E847]" />

              <span className="text-sm text-white/70">
                {isArabic
                  ? 'اكتشف العالم من منظور مختلف'
                  : 'Explore the world from a different perspective'}
              </span>

            </div>

          </div>

        </section>

        {/* FORM SIDE */}

        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">

          {/* Mobile Brand */}

          <div className="lg:hidden mb-8 text-center">

            <span className="text-[#121528] font-black text-3xl tracking-widest">
              DUCK.
            </span>

          </div>

          <div className="max-w-md w-full mx-auto">

            {/* Heading */}

            <div className="mb-8">

              <span className="inline-block text-[#067BA1] font-bold text-sm mb-3 tracking-wider">
                IN DUCK WE TRUST
              </span>

              <h1 className="text-3xl sm:text-4xl font-black text-[#121528] mb-3">
                {t('auth.signup.title')}
              </h1>

              <p className="text-gray-500 leading-7">
                {t('auth.signup.subtitle')}
              </p>

            </div>

            {/* General Error */}

            {generalError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm leading-6">
                  {generalError}
                </p>
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >

              {/* Full Name */}

              <FormField
                label={t('auth.signup.fullName')}
                icon={<User size={19} />}
                error={errors.fullName}
              >

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={updateField}
                  placeholder={t('auth.signup.fullNamePlaceholder')}
                  autoComplete="name"
                  className={inputClasses}
                />

              </FormField>

              {/* Email */}

              <FormField
                label={t('auth.signup.email')}
                icon={<Mail size={19} />}
                error={errors.email}
              >

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={updateField}
                  placeholder={t('auth.signup.emailPlaceholder')}
                  autoComplete="email"
                  className={inputClasses}
                />

              </FormField>

              {/* Phone */}

              <FormField
                label={t('auth.signup.phone')}
                icon={<Phone size={19} />}
                error={errors.phone}
              >

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={updateField}
                  placeholder={t('auth.signup.phonePlaceholder')}
                  autoComplete="tel"
                  className={inputClasses}
                />

              </FormField>

              {/* Password */}

              <FormField
                label={t('auth.signup.password')}
                icon={<Lock size={19} />}
                error={errors.password}
              >

                <div className="relative">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={updateField}
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    autoComplete="new-password"
                    className={`${inputClasses} ${isArabic ? 'pl-12' : 'pr-12'}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? t('auth.signup.hidePassword')
                        : t('auth.signup.showPassword')
                    }
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#067BA1] ${
                      isArabic ? 'left-4' : 'right-4'
                    }`}
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </FormField>

              {/* Confirm Password */}

              <FormField
                label={t('auth.signup.confirmPassword')}
                icon={<Lock size={19} />}
                error={errors.confirmPassword}
              >

                <div className="relative">

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={updateField}
                    placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                    autoComplete="new-password"
                    className={`${inputClasses} ${isArabic ? 'pl-12' : 'pr-12'}`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? t('auth.signup.hidePassword')
                        : t('auth.signup.showPassword')
                    }
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#067BA1] ${
                      isArabic ? 'left-4' : 'right-4'
                    }`}
                  >

                    {showConfirmPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />}

                  </button>

                </div>

              </FormField>

              {/* Terms */}

              <div className="pt-2">

                <label className="flex items-start gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={updateField}
                    className="mt-1 w-4 h-4 accent-[#067BA1] shrink-0"
                  />

                  <span className="text-sm text-gray-600 leading-6">
                    {t('auth.signup.terms')}
                  </span>

                </label>

                {errors.terms && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.terms}
                  </p>
                )}

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 mt-3 flex items-center justify-center gap-3 rounded-xl bg-[#F5E847] hover:bg-[#e9dc35] text-[#121528] font-black text-base transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#F5E847]/15 disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {isSubmitting
                  ? (isArabic ? 'جاري إنشاء الحساب...' : 'Creating account...')
                  : t('auth.signup.submit')}

                {!isSubmitting &&
                  (isArabic
                    ? <ArrowLeft size={20} />
                    : <ArrowRight size={20} />
                  )}

              </button>

            </form>

            {/* Login Link */}

            <div className="mt-8 text-center text-sm text-gray-500">

              {t('auth.signup.alreadyHaveAccount')}

              <Link
                to="/login"
                className="font-bold text-[#067BA1] hover:text-[#121528] transition-colors ms-2"
              >
                {t('auth.signup.login')}
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

function FormField({ label, icon, error, children }) {
  return (
    <div>

      <label className="block text-sm font-bold text-[#121528] mb-2">

        <span className="flex items-center gap-2">

          <span className="text-[#067BA1]">
            {icon}
          </span>

          {label}

        </span>

      </label>

      {children}

      {error && (
        <p className="text-red-500 text-xs mt-2">
          {error}
        </p>
      )}

    </div>
  );
}

export default CreateAccountPage;