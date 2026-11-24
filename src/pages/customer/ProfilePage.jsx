import { useRef, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Camera,
  Pencil,
  Save,
  X,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useTranslation } from "../../shared/i18n/index.js";

import {
  getCurrentUser,
  updateCurrentUser,
} from "../../entities/user/api/authService.js";

function ProfilePage() {
  const { lang } = useTranslation();
  const isArabic = lang === "ar";

  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState(() => {
    return (
      getCurrentUser() || {
        fullName: "",
        email: "",
        phone: "",
        profileImage: "",
      }
    );
  });

  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
  });

  // Handle text inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
    setSavedMessage("");
  };

  // Upload profile image
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        isArabic
          ? "يرجى اختيار ملف صورة صالح."
          : "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 1.5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        isArabic
          ? "حجم الصورة يجب ألا يتجاوز 1.5 ميجابايت."
          : "Image size must not exceed 1.5 MB."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const updatedUser = updateCurrentUser({
          profileImage: reader.result,
        });

        if (!updatedUser) {
          throw new Error("Unable to update profile image");
        }

        setProfile(updatedUser);
        setErrorMessage("");

        setSavedMessage(
          isArabic
            ? "تم تحديث صورتك الشخصية بنجاح."
            : "Profile picture updated successfully."
        );

        setTimeout(() => setSavedMessage(""), 3000);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          isArabic
            ? "تعذر حفظ الصورة. حاول اختيار صورة أصغر."
            : "Unable to save the image. Try a smaller image."
        );
      }

      event.target.value = "";
    };

    reader.onerror = () => {
      setErrorMessage(
        isArabic
          ? "حدث خطأ أثناء قراءة الصورة."
          : "An error occurred while reading the image."
      );

      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // Remove profile image
  const handleRemoveImage = () => {
    try {
      const updatedUser = updateCurrentUser({
        profileImage: "",
      });

      if (!updatedUser) {
        throw new Error("Unable to remove profile image");
      }

      setProfile(updatedUser);
      setErrorMessage("");

      setSavedMessage(
        isArabic
          ? "تم حذف الصورة الشخصية."
          : "Profile picture removed."
      );

      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        isArabic
          ? "تعذر حذف الصورة."
          : "Unable to remove the image."
      );
    }
  };

  // Save profile changes
  const handleSave = (event) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMessage(
        isArabic
          ? "يرجى إدخال الاسم بالكامل."
          : "Please enter your full name."
      );

      return;
    }

    try {
      const updatedUser = updateCurrentUser({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      if (!updatedUser) {
        throw new Error("Unable to update profile");
      }

      setProfile(updatedUser);

      setFormData({
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      setIsEditing(false);
      setErrorMessage("");

      setSavedMessage(
        isArabic
          ? "تم حفظ بياناتك بنجاح"
          : "Your profile has been saved successfully"
      );

      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        isArabic
          ? "تعذر حفظ البيانات. يرجى تسجيل الدخول مرة أخرى."
          : "Unable to save your profile. Please log in again."
      );
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });

    setErrorMessage("");
    setIsEditing(false);
  };

  // Get user's first initial
  const getInitial = () => {
    return profile.fullName?.trim()?.charAt(0).toUpperCase() || "U";
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C1226] outline-none transition focus:border-[#147D9F] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-7"
    >
      {/* Page Heading */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[2px] text-[#147D9F]">
          DUCK CUSTOMER PORTAL
        </span>

        <h2 className="mt-2 text-2xl font-black text-[#0C1226]">
          {isArabic ? "الملف الشخصي" : "My Profile"}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {isArabic
            ? "إدارة بياناتك الشخصية وإعدادات حسابك."
            : "Manage your personal information and account settings."}
        </p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {savedMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-[#0C1226] to-[#147D9F]" />

        <div className="px-6 pb-7">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex items-end gap-4">

              {/* Profile Image */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#FDFB45] text-3xl font-black text-[#0C1226] shadow-md">

                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  getInitial()
                )}

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#147D9F] text-white transition hover:bg-[#0C1226]"
                  aria-label={
                    isArabic
                      ? "تغيير الصورة الشخصية"
                      : "Change profile picture"
                  }
                  title={
                    isArabic
                      ? "تغيير الصورة"
                      : "Change picture"
                  }
                >
                  <Camera size={15} />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Remove Image Button */}
                {profile.profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white transition hover:bg-red-700"
                    aria-label={
                      isArabic
                        ? "حذف الصورة"
                        : "Remove picture"
                    }
                    title={
                      isArabic
                        ? "حذف الصورة"
                        : "Remove picture"
                    }
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="pb-1">
                <h3 className="text-lg font-black text-[#0C1226]">
                  {profile.fullName ||
                    (isArabic ? "مستخدم جديد" : "New User")}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {isArabic ? "عضو في DUCK" : "DUCK Member"}
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setSavedMessage("");
                  setErrorMessage("");
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0C1226] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#147D9F]"
              >
                <Pencil size={16} />
                {isArabic ? "تعديل البيانات" : "Edit Profile"}
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Personal Information */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#147D9F]/10 text-[#147D9F]">
            <UserRound size={21} />
          </div>

          <div>
            <h3 className="font-bold text-[#0C1226]">
              {isArabic ? "المعلومات الشخصية" : "Personal Information"}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              {isArabic
                ? "بيانات حسابك الأساسية"
                : "Your basic account information"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0C1226]">
              {isArabic ? "الاسم بالكامل" : "Full Name"}
            </label>

            <div className="relative">
              <UserRound
                size={17}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isArabic ? "right-4" : "left-4"
                }`}
              />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={isArabic ? "اسمك بالكامل" : "Your full name"}
                className={`${inputClass} ${
                  isArabic ? "pr-11" : "pl-11"
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0C1226]">
              {isArabic ? "البريد الإلكتروني" : "Email Address"}
            </label>

            <div className="relative">
              <Mail
                size={17}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isArabic ? "right-4" : "left-4"
                }`}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                placeholder={isArabic ? "البريد الإلكتروني" : "Email address"}
                className={`${inputClass} ${
                  isArabic ? "pr-11" : "pl-11"
                }`}
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              {isArabic
                ? "لا يمكن تغيير البريد الإلكتروني حاليًا."
                : "Email address cannot be changed at the moment."}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0C1226]">
              {isArabic ? "رقم الهاتف" : "Phone Number"}
            </label>

            <div className="relative">
              <Phone
                size={17}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isArabic ? "right-4" : "left-4"
                }`}
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={isArabic ? "رقم الهاتف" : "Phone number"}
                className={`${inputClass} ${
                  isArabic ? "pr-11" : "pl-11"
                }`}
              />
            </div>
          </div>

        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#0C1226] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#147D9F]"
            >
              <Save size={17} />
              {isArabic ? "حفظ التغييرات" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-50"
            >
              <X size={17} />
              {isArabic ? "إلغاء" : "Cancel"}
            </button>

          </div>
        )}
      </form>

      {/* Password Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#147D9F]/10 text-[#147D9F]">
              <LockKeyhole size={21} />
            </div>

            <div>
              <h3 className="font-bold text-[#0C1226]">
                {isArabic ? "كلمة المرور" : "Password"}
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                {isArabic
                  ? "إدارة إعدادات كلمة المرور"
                  : "Manage your password settings"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="rounded-xl border border-[#147D9F]/20 px-5 py-3 text-sm font-bold text-[#147D9F] transition hover:bg-[#147D9F]/5"
          >
            {showPasswordForm
              ? isArabic
                ? "إغلاق"
                : "Close"
              : isArabic
                ? "تغيير كلمة المرور"
                : "Change Password"}
          </button>

        </div>

        {showPasswordForm && (
          <div className="mt-6 rounded-xl border border-gray-100 bg-[#F8FAFC] p-5">

            <div className="mb-4 flex items-center gap-2 text-xs text-amber-700">
              <ShieldCheck size={17} />

              {isArabic
                ? "تغيير كلمة المرور غير متاح حاليًا في النسخة التجريبية."
                : "Password changes are not available in the current demo."}
            </div>

            <div className="space-y-4">
              <input
                type="password"
                disabled
                placeholder={
                  isArabic ? "كلمة المرور الحالية" : "Current Password"
                }
                className={inputClass}
              />

              <input
                type="password"
                disabled
                placeholder={
                  isArabic ? "كلمة المرور الجديدة" : "New Password"
                }
                className={inputClass}
              />

              <input
                type="password"
                disabled
                placeholder={
                  isArabic
                    ? "تأكيد كلمة المرور الجديدة"
                    : "Confirm New Password"
                }
                className={inputClass}
              />
            </div>

          </div>
        )}

      </div>

    </section>
  );
}

export default ProfilePage;