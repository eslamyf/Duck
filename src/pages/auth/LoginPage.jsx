import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';

import kayakImage from '../../shared/assets/images/trips/botanical-garden-960w.webp';

function LoginPage() {
  const { lang } = useTranslation();

  const isArabic = lang === 'ar';

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = isArabic
        ? 'البريد الإلكتروني مطلوب'
        : 'Email address is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = isArabic
        ? 'أدخل بريدًا إلكترونيًا صحيحًا'
        : 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = isArabic
        ? 'كلمة المرور مطلوبة'
        : 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Frontend demonstration only.
    // Real authentication will be connected later.
    setSuccess(true);
  };

  const inputClasses = `
    w-full h-[48px]
    bg-[#F7F7F4]
    border border-[#E7E8ED]
    rounded-xl
    px-5
    text-[#121528]
    placeholder:text-gray-400
    outline-none
    transition-all duration-300
    focus:bg-white
    focus:border-[#067BA1]
    focus:ring-4
    focus:ring-[#067BA1]/10
  `;

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative w-full h-[100dvh] min-h-0 overflow-hidden p-2 sm:p-4 lg:p-6 flex items-center justify-center"
    >

      {/* FULL SCREEN ASWAN BACKGROUND */}

      <img
        src={kayakImage}
        alt={isArabic ? 'مناظر طبيعية من أسوان' : 'Aswan landscape'}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-[#121528]/65" />

      <div className="absolute inset-0 bg-gradient-to-br from-[#121528]/50 via-transparent to-[#067BA1]/20" />


      {/* MAIN LOGIN CARD */}

      <div className="relative z-10 w-full max-w-[1400px] h-full max-h-[850px] min-h-0 bg-white rounded-[22px] lg:rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">


        {/* LEFT SIDE - ADVENTURE IMAGE */}

        <section className="relative hidden lg:block overflow-hidden">

          <img
            src={kayakImage}
            alt={isArabic ? 'مغامرة كاياك في أسوان' : 'Kayaking adventure in Aswan'}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[1500ms]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#090D1C] via-[#121528]/50 to-[#121528]/15" />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#121528]/15" />


          {/* BRAND LOGO */}

          <div className="absolute top-9 left-10 right-10 flex items-center justify-between">

            <Link
              to="/"
              className="text-white text-4xl font-black tracking-[5px]"
            >
              DUCK<span className="text-[#F5E847]">.</span>
            </Link>

            <span className="text-white/70 text-[10px] tracking-[4px] font-bold">
              ADVENTURE BEGINS HERE
            </span>

          </div>


          {/* ADVENTURE CONTENT */}

          <div className="absolute bottom-10 left-10 right-10 text-white">

            <div className="flex items-center gap-3 mb-5">

              <span className="w-12 h-[3px] bg-[#F5E847]" />

              <span className="text-[#F5E847] uppercase tracking-[4px] text-xs font-bold">
                {isArabic ? 'مرحبًا بعودتك' : 'WELCOME BACK'}
              </span>

            </div>


            <h1 className="text-4xl xl:text-[58px] font-black leading-[1.15] mb-5 max-w-xl">

              {isArabic ? (
                <>
                  مستعد لمغامرتك

                  <span className="text-[#F5E847] block">
                    القادمة؟
                  </span>
                </>
              ) : (
                <>
                  THE ADVENTURE

                  <span className="text-[#F5E847] block">
                    NEVER ENDS.
                  </span>
                </>
              )}

            </h1>


            <p className="text-white/75 text-base xl:text-lg leading-8 max-w-md">

              {isArabic
                ? 'سعداء بعودتك! سجل دخولك واكتشف تجارب جديدة تنتظرك مع DUCK.'
                : 'Great to have you back. Sign in and discover new experiences waiting for you with DUCK.'}

            </p>


            {/* ADVENTURE COMMUNITY */}

            <div className="flex items-center gap-5 mt-8">

              <div className="flex -space-x-3 rtl:space-x-reverse">

                {['A', 'M', 'D', 'K'].map((letter, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-[#121528] bg-[#F5E847] flex items-center justify-center text-[#121528] font-bold text-sm"
                  >
                    {letter}
                  </div>
                ))}

              </div>

              <div>

                <p className="text-white text-sm font-bold">
                  {isArabic
                    ? 'المغامرة أجمل مع الأصدقاء'
                    : 'Adventure is better together'}
                </p>

                <p className="text-white/50 text-xs mt-1">
                  DUCK EXPERIENCE
                </p>

              </div>

            </div>

          </div>


          {/* DECORATIVE CIRCLES */}

          <div className="absolute top-1/2 right-[-60px] w-40 h-40 rounded-full border border-[#F5E847]/20" />

          <div className="absolute top-1/2 right-[-35px] w-28 h-28 rounded-full border border-[#F5E847]/20" />

        </section>



        {/* RIGHT SIDE - LOGIN FORM */}

        <section className="relative flex items-center justify-center px-4 py-3 sm:px-8 lg:px-10 xl:px-14 min-h-0 overflow-hidden">

          {/* DECORATIVE BACKGROUND */}

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#067BA1]/5 rounded-full blur-3xl pointer-events-none" />


          <div className="relative w-full max-w-[430px]">


            {/* MOBILE LOGO */}

            <div className="lg:hidden text-center mb-4">

              <Link
                to="/"
                className="text-[#121528] text-3xl font-black tracking-[5px]"
              >
                DUCK<span className="text-[#067BA1]">.</span>
              </Link>

            </div>



            {/* HEADING */}

            <div className="mb-5">

              <h2 className="text-[30px] sm:text-[36px] lg:text-[38px] font-black text-[#121528] tracking-tight mb-3 leading-tight">

                {isArabic ? (
                  <>
                    مغامرتك القادمة

                    <span className="block text-[#067BA1]">
                      تبدأ من هنا.
                    </span>
                  </>
                ) : (
                  <>
                    YOUR NEXT ADVENTURE

                    <span className="block text-[#067BA1]">
                      STARTS HERE.
                    </span>
                  </>
                )}

              </h2>


              <p className="text-gray-500 text-sm sm:text-base leading-7">

                {isArabic
                  ? 'سجل الدخول إلى حسابك لمتابعة مغامراتك.'
                  : 'Sign in to your account and continue your adventure.'}

              </p>

            </div>



            {/* SUCCESS MESSAGE */}

            {success && (

              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">

                <p className="text-green-700 text-xs sm:text-sm leading-6">

                  {isArabic
                    ? 'تم التحقق من البيانات بنجاح! تسجيل الدخول الحقيقي سيتاح بعد ربط نظام المصادقة.'
                    : 'Your information has been validated! Real sign-in will be available once authentication is connected.'}

                </p>

              </div>

            )}



            {/* LOGIN FORM */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >


              {/* EMAIL */}

              <div>

                <label className="block text-sm font-bold text-[#121528] mb-2">

                  {isArabic ? 'البريد الإلكتروني' : 'Email Address'}

                </label>


                <div className="relative">

                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                      isArabic ? 'right-5' : 'left-5'
                    }`}
                  >
                    @
                  </span>


                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={updateField}
                    placeholder="example@email.com"
                    autoComplete="email"
                    className={`${inputClasses} ${
                      isArabic ? 'pr-12' : 'pl-12'
                    }`}
                  />

                </div>


                {errors.email && (

                  <p className="text-red-500 text-xs mt-2">
                    {errors.email}
                  </p>

                )}

              </div>



              {/* PASSWORD */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-bold text-[#121528]">

                    {isArabic ? 'كلمة المرور' : 'Password'}

                  </label>


                  <button
                    type="button"
                    className="text-xs font-bold text-[#067BA1] hover:text-[#121528] transition-colors"
                    onClick={() => {
                      alert(
                        isArabic
                          ? 'ميزة استعادة كلمة المرور سيتم إضافتها لاحقًا.'
                          : 'Password recovery will be added later.'
                      );
                    }}
                  >

                    {isArabic
                      ? 'نسيت كلمة المرور؟'
                      : 'Forgot Password?'}

                  </button>

                </div>


                <div className="relative">

                  {/* LOCK ICON */}

                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                      isArabic ? 'right-5' : 'left-5'
                    }`}
                  >

                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>

                  </span>


                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={updateField}
                    placeholder={
                      isArabic
                        ? 'أدخل كلمة المرور'
                        : 'Enter your password'
                    }
                    autoComplete="current-password"
                    className={`${inputClasses} ${
                      isArabic ? 'pr-12 pl-14' : 'pl-12 pr-14'
                    }`}
                  />


                  {/* SHOW / HIDE PASSWORD */}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#067BA1] transition-colors ${
                      isArabic ? 'left-5' : 'right-5'
                    }`}
                  >

                    {showPassword ? (

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 9 5 9 7s-4 7-9 7a9.8 9.8 0 0 1-5.1-1.5" />
                        <path d="M6.2 6.2C4.1 7.6 3 10 3 12c0 1.2 1 2.8 2.5 4.2" />
                      </svg>

                    ) : (

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>

                    )}

                  </button>

                </div>


                {errors.password && (

                  <p className="text-red-500 text-xs mt-2">
                    {errors.password}
                  </p>

                )}

              </div>



              {/* REMEMBER ME */}

              <div className="flex items-center justify-between pt-1">

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#067BA1] cursor-pointer"
                  />

                  <span className="text-sm text-gray-500">
                    {isArabic ? 'تذكرني' : 'Remember me'}
                  </span>

                </label>

              </div>



              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="group relative w-full h-[52px] overflow-hidden rounded-xl bg-[#121528] text-white font-black text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#121528]/20 hover:-translate-y-0.5"
              >

                <span className="absolute inset-0 bg-[#067BA1] translate-x-full rtl:-translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />


                <span className="relative z-10 flex items-center justify-center gap-3">

                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}


                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  >
                    <path d={isArabic ? 'M19 12H5' : 'M5 12h14'} />
                    <path d={isArabic ? 'm12 5-7 7 7 7' : 'm12 5 7 7-7 7'} />
                  </svg>

                </span>

              </button>

            </form>



            {/* SIGN UP DIVIDER */}

            <div className="flex items-center gap-4 my-4">

              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-gray-400 text-[10px] font-bold tracking-wider">
                {isArabic ? 'جديد في DUCK؟' : 'NEW TO DUCK?'}
              </span>

              <div className="flex-1 h-px bg-gray-200" />

            </div>



            {/* SIGN UP CTA */}

            <div className="p-3 rounded-xl bg-[#F7F7F4] border border-[#E7E8ED] text-center">

              <p className="text-xs sm:text-sm text-gray-600 mb-3">

                {isArabic
                  ? 'لسه معندكش حساب في DUCK؟'
                  : "Don't have an account with DUCK yet?"}

              </p>


              <Link
                to="/create-account"
                className="group w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-[#F5E847] hover:bg-[#e9dc35] text-[#121528] font-black text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >

                {isArabic
                  ? 'أنشئ حسابك وابدأ المغامرة'
                  : 'CREATE YOUR ACCOUNT'}


                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  ↗
                </span>

              </Link>

            </div>



            {/* FOOTER */}

            <div className="mt-3 text-center">

              <p className="text-[9px] text-gray-400 tracking-[3px] font-bold">
                DUCK ENTERTAINMENT
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default LoginPage;