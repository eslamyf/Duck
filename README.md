# 🦆 Duck — Water Sports & Marine Activities Platform

[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Design Tokens](https://img.shields.io/badge/Brand-In%20Duck%20We%20Trust-F5E847)](https://www.duckegy.com/)

منصة ويب عصرية وتفاعلية لحجز الأنشطة والتجارب المائية في مصر (Kayak, SUP, Water Bike)، بشعارها الرسمي **"IN DUCK WE TRUST"**. تم بناء الواجهة وفق معمارية **Feature-Sliced Design (FSD)** ومجهزة بنظام تسعير مزدوج (مصري/أجنبي)، وحجز كزائر، ودعم ثنائي اللغة والعملة.

---

## 1. نظرة عامة (Overview)

تهدف منصة **Duck** إلى رقمنة وتسهيل تجربة حجز الأنشطة البحرية والرياضات المائية على نهر النيل والوجهات الساحلية في مصر، من خلال تجربة مستخدم سلسة تستهدف الزوار المحليين والسياح الأجانب والشركات.

- **نطاق العمل (In-Scope):** تطبيق واجهة أمامية كامل (Frontend Web Application) يغطي تجربة العميل (Buyer) من الاستكشاف حتى الدفع الإلكتروني، ودعوة إنشاء الحساب، وطلبات المجموعات والشركات (B2B)، ولوحة تحكم الإدارة (Admin Dashboard).
- **خارج نطاق العمل (Out-of-Scope):** بناء خوادم وقواعد بيانات الـ Backend، وبوابات الدفع البنكية الفعلية، وعقود مزودي الرسائل النصية SMS (سيتم الربط معها عبر API Contracts).
- **المرجع الهندسي المعتمد:** مواصفات متطلبات البرمجيات وفق معيار **IEEE 29148 (الإصدار 3.0 بتاريخ 15 نوفمبر 2026)** — مبادرة **CreativeZ** (فريق Tech & Web Track).
- **الهوية البصرية الرسمية:**
  - **Navy (الكحلي الداكن):** `#121528`
  - **Blue (الأزرق المائي):** `#067BA1`
  - **Yellow (الأصفر المميز):** `#F5E847`
- **الجدول الزمني للتسليم:**
  - **اعتماد ملف التخطيط المعماري:** 20 نوفمبر 2026
  - **تجميد الكود والتسليم النهائي (Code Freeze & Final Delivery):** 27 نوفمبر 2026
- **أهم الميزات:**
  - تسعير مزدوج واضح وشفاف (جنيه مصري للمصريين / دولار أمريكي للأجانب) على بطاقات الأنشطة.
  - مسار حجز سريع كزائر (Guest Checkout) بدون إجبار على التسجيل المسبق.
  - دعوة ذكية وسلسة لإنشاء حساب بعد نجاح الحجز لحفظ التذاكر وتتبعها.
  - طلب عروض أسعار للشركات والمجموعات الكبيرة (B2B Quote).
  - لوحة تحكم إدارية شاملة للمؤشرات والحجوزات والأنشطة والطلبات.
  - دعم متعدد اللغات (عربي RTL / إنجليزي LTR) وتبديل العملات (EGP / USD / EUR).

---

## 2. التقنيات المستخدمة (Tech Stack)

تم حصر كافة الحزم البرمجية مباشرة من ملف `package.json` الفعلي للمشروع:

| الحزمة (Package) | الإصدار (Version) | الغرض |
| :--- | :--- | :--- |
| **react** | `^19.3.1` | مكتبة بناء واجهات المستخدم الأساسية |
| **react-dom** | `^19.3.1` | محرك تصيير عناصر React على الـ DOM |
| **vite** | `^8.3.6` | بيئة التطوير وأداة البناء فائقة السرعة |
| **@vitejs/plugin-react** | `^6.1.2` | إضافة دعم React ومحول JSX داخل Vite |
| **eslint** | `^10.14.0` | أداة التدقيق وفحص جودة الكود البرمجي |
| **eslint-plugin-react-hooks** | `^7.1.1` | فرض قواعد استخدام الـ Hooks القياسية |
| **eslint-plugin-react-refresh** | `^0.5.7` | دعم التحديث اللحظي للمكونات (Fast Refresh) |
| **globals** | `^17.13.0` | تعريف المتغيرات العامة لبيئة عمل JavaScript |
| **@types/react** | `^19.3.0` | تعريفات الأنواع البرمجية لمكتبة React |
| **@types/react-dom** | `^19.3.0` | تعريفات الأنواع البرمجية لمكتبة ReactDOM |

---

## 3. التشغيل السريع (Getting Started)

### المتطلبات المسبقة (Prerequisites)
- **Node.js:** إصدار `18.0.0` أو أحدث (يُفضل إصدار LTS مثل `v20.x` أو `v22.x`).
- **مدير الحزم:** `npm` (مرفق تلقائيًا مع Node.js).

### خطوات التثبيت والتشغيل
```bash
# 1. تثبيت الاعتماديات
npm install

# 2. تشغيل السيرفر المحلي في بيئة التطوير
npm run dev

# 3. فحص الكود والالتزام بالمعايير (Linting)
npm run lint

# 4. بناء المشروع للإنتاج (Production Build)
npm run build

# 5. معاينة ناتج البناء محليًا (Preview Build)
npm run preview
```

> **ملاحظة بخصوص الاختبارات:** أمر تشغيل الاختبارات (`npm test`) غير مدرج حاليًا ضمن `scripts` في ملف `package.json` [قيد الإضافة]، وملف تهيئة `vitest.config.js` متوفر في جذر المشروع للتفعيل لاحقًا.

---

## 4. متغيرات البيئة (Environment Variables)

ملف `.env.example` متواجد في جذر المشروع:

> **الحالة:** `[قيد الإضافة]`  
> ملف `.env.example` مهيأ حاليًا كملف تأسيسي فارغ (0 Bytes) بانتظار استقرار عقود الـ Backend، والمتغيرات المخطط ربطها تشمل: عنوان الخادم `VITE_API_URL`، ومفاتيح التحليلات `VITE_META_PIXEL_ID` و `VITE_GA_ID`، ومفتاح خرائط جوجل `VITE_GMAPS_KEY`، ومفعل البيانات الوهمية `VITE_USE_MOCKS`.

---

## 5. هيكل المشروع (Project Structure)

يتبع مجلد `src/` الهيكل الفعلي التالي:

```text
src/
├── app/                    # تهيئة التطبيق، الـ Providers، والمسارات المركزية
│   ├── providers/          # موفرو السياق (Auth, Language, Currency, ErrorBoundary)
│   ├── routes/             # جداول التوجيه وحراس الصلاحيات (AppRouter, ProtectedRoute)
│   └── App.jsx             # جذر التطبيق الرئيسي
├── pages/                  # تجميع صفحات التطبيق كـ Views مستقلة
│   ├── home/               # الصفحة الرئيسية (HomePage)
│   ├── activity-details/   # صفحة تفاصيل النشاط والأسعار والصور
│   ├── booking/            # مسار الحجز والدفع والنتائج (Booking, Confirmation, Payment)
│   ├── b2b/                # صفحات الشركات وعروض الأسعار والتأكيد
│   ├── auth/               # تسجيل الدخول وإنشاء حساب جديد
│   ├── account/            # مساحة المستخدم وتذاكر الحجز (MyBookingsPage)
│   ├── static/             # الصفحات التعريفية والسياسات والأمان
│   ├── not-found/          # صفحة الخطأ 404
│   └── admin/              # صفحات لوحة التحكم (المؤشرات، الحجوزات، الأنشطة، العروض)
├── layouts/                # قوالب التخطيط الهيكلية (MainLayout, AdminLayout, BookingLayout)
├── widgets/                # مكونات مركبة تشكل أقساماً كاملة في الواجهة
│   ├── navbar/             # الشريط العلوي الرئيسي
│   ├── footer/             # التذييل وروابط التواصل والمعلومات
│   ├── hero/               # القسم الافتتاحي الرئيسي
│   ├── activities-grid/    # شبكة استعراض الأنشطة مع الفلاتر
│   ├── destinations/       # بطاقات الوجهات السياحية ونقاط التجمع
│   ├── reviews/            # قسم مراجعات وتقييمات العملاء
│   ├── faq/                # الأسئلة الشائعة القابلة للطي
│   └── admin-sidebar/      # القائمة الجانبية للوحة الأدمن
├── features/               # الميزات التفاعلية التي تمثل قيمة وظيفية للمستخدم
│   ├── guest-checkout/     # خطوات الحجز السريع بدون تسجيل مسبق
│   ├── currency-language-switcher/ # مبدل العملات واللغات
│   ├── activity-filter/    # تصفية الأنشطة بحسب الوجهة والتصنيف
│   ├── b2b-quote/          # استمارة حجز المجموعات الكبيرة (>= 10 أفراد)
│   ├── payment-result/     # معالجة استجابات الدفع (نجاح / فشل / معلق)
│   └── admin-management/   # أدوات الأدمن لإدارة الحجوزات والأسعار
├── entities/               # كيانات نطاق العمل (Domain Entities) ونماذج البيانات
│   ├── activity/           # كيان النشاط (البيانات، البطاقة، السعة القصوى)
│   ├── booking/            # كيان الحجز (الحسابات، السعة، سياسة الإلغاء، الحالات)
│   ├── destination/        # كيان الوجهة ونقاط التجمع
│   ├── quote/              # كيان طلبات عروض أسعار الشركات
│   ├── review/             # كيان التقييمات والآراء
│   └── user/               # كيان المستخدم والصلاحيات (Guest | Buyer | Admin)
├── shared/                 # الأدوات والمكونات العامة المجردة من منطق العمل
│   ├── ui/                 # عناصر واجهة المستخدم الأولية (Button, Input, Modal, Badge...)
│   ├── styles/             # ملفات التنسيق العامة وتوكنز الألوان (tokens.css, reset.css)
│   ├── config/             # الثوابت العامة، المسارات، وإعدادات البيئة
│   ├── i18n/               # ملفات الترجمة (ar.json, en.json) والتهيئة
│   ├── hooks/              # الـ Custom Hooks العامة (useCurrency, useMediaQuery...)
│   ├── lib/                # مكتبات التنسيق والتحليلات والـ SEO
│   └── api/                # عميل الشبكة (httpClient) ونظام الـ Mocks
├── index.css               # التنسيقات الجذرية وتضمين tokens.css
└── main.jsx                # نقطة الانطلاق وتثبيت تطبيق React في الـ DOM
```

---

## 6. معمارية المشروع (Feature-Sliced Design)

يعتمد المشروع نمط **Feature-Sliced Design (FSD)** لضمان قابلية التوسع والصيانة وفصل المسؤوليات بوضوح:

### تسلسل الطبقات من الأعلى للأسفل:
1. **app:** تهيئة التطبيق العامة وربط المزودات (Providers) والتوجيه.
2. **pages:** صفحات كاملة تجمّع الـ Widgets بدون منطق عمل معقد خاص بها.
3. **layouts:** هياكل الإطارات الخارجية (Header/Sidebar/Footer).
4. **widgets:** كتل واجهة مكتملة تتكون من دمج ميزات وكيانات متعددة (مثل Navbar، HeroSection).
5. **features:** تفاعلات المستخدم التي تحقق هدفًا وظيفيًا (مثل GuestCheckout، DestinationsFilter).
6. **entities:** نماذج البيانات وكيانات الأعمال الخاصة بنطاق Duck (مثل Activity، Booking).
7. **shared:** اللبنات الأساسية الخالية من أي تفاصيل تخص نطاق العمل (UI Primitives، API Clients، Utils).

### قاعدة الاستيراد الصارمة (Unidirectional Import Rule):
> يُسمح لأي طبقة باستيراد الوحدات من **الطبقات الأدنى منها فقط**، ويُحظر تمامًا الاستيراد العكسي أو الأفقي بين الوحدات داخل نفس الطبقة (إلا عبر الـ Public API).

- **مثال صحيح:**
  ```javascript
  // في طبقة features/guest-checkout يستورد من entities و shared:
  import { priceCalculator } from '@/entities/booking';
  import { Button } from '@/shared/ui/Button';
  ```
- **مثال خاطئ (مخالف للمعمارية):**
  ```javascript
  // خطأ: طبقة shared لا يجوز لها استيراد كيان من entities!
  import { activitiesData } from '@/entities/activity'; // ❌ Violation
  ```

### دور `index.js` كـ Public API:
كل مجلد فرعي داخل الشرائح (Slices) يمتلك ملف `index.js` يُعد هو البوابة الوحيدة المسموح بالاستيراد منها خارج الشريحة، مما يحمي تفاصيل التنفيذ الداخلية من التبعيات المتشابكة.

---

## 7. جدول المسارات المعتمدة (Application Routes)

> **الحالة:** `[قيد الإضافة في كود AppRouter.jsx]`  
> ملف `src/app/routes/AppRouter.jsx` مهيأ حالياً كملف فارغ (0 Bytes) بانتظار ربط مكتبة التوجيه. فيما يلي جدول المسارات المعتمد وفق هيكل المجلدات المنفذ في `src/pages/` ووثيقة SRS:

| المسار (Route) | مكون الصفحة (Page Component) | المجلد | الصلاحية (Access Level) |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | `pages/home` | Public (الجميع) |
| `/activities/:id` | `ActivityDetailsPage` | `pages/activity-details` | Public (الجميع) |
| `/booking` | `BookingPage` | `pages/booking` | Public / Guest |
| `/booking/confirmation/:ref`| `BookingConfirmationPage` | `pages/booking` | Public (برقم الحجز) |
| `/payment/callback` | `PaymentResultPage` | `pages/booking` | Public (بعد الدفع) |
| `/b2b` | `B2BPage` | `pages/b2b` | Public / Corporate |
| `/b2b/confirmation/:ref` | `B2BConfirmationPage` | `pages/b2b` | Public (برقم الطلب) |
| `/my-bookings` | `MyBookingsPage` | `pages/account` | Buyer (مستخدم مسجل) |
| `/login` | `LoginPage` | `pages/auth` | Guest فقط |
| `/register` | `CreateAccountPage` | `pages/auth` | Guest فقط |
| `/about`, `/safety`, `/terms`| `StaticInfoPage` | `pages/static` | Public (الجميع) |
| `/admin/dashboard` | `AdminDashboardPage` | `pages/admin` | Admin فقط |
| `/admin/bookings` | `AdminBookingsPage` | `pages/admin` | Admin فقط |
| `/admin/quotes` | `AdminQuotesPage` | `pages/admin` | Admin فقط |
| `/admin/activities` | `AdminActivitiesPage` | `pages/admin` | Admin فقط |
| `*` | `NotFoundPage` | `pages/not-found` | Public (404) |

---

## 8. الأدوار والصلاحيات (Roles & Access Control)

يدعم النظام 3 أدوار رئيسية تُدار مركزياً عبر `src/app/providers/AuthProvider.jsx` وحارس المسارات `src/app/routes/ProtectedRoute.jsx`:

1. **الزائر (Guest):**
   - استعراض كامل الأنشطة والوجهات وقراءة التقييمات والأسئلة الشائعة.
   - حجز الأنشطة مباشرة عبر **Guest Checkout** دون اشتراط التسجيل المسبق.
   - اختيار العملة المناسبة واللغة (عربي / إنجليزي).
2. **المشتري المسجل (Buyer):**
   - يمتلك كافة صلاحيات الزائر.
   - الدخول إلى صفحة تذاكري (`/my-bookings`) لاستعراض الحجوزات السابقة والحالية وحالة الدفع.
   - إمكانية إنشاء حسابه بضغطة زر وبكلمة مرور فقط بعد إتمام الحجز السريع.
3. **المسؤول (Admin):**
   - الوصول الحصري لمسارات لوحة التحكم تحت البادئة `/admin/*`.
   - استعراض الإحصائيات العامة والإيرادات وإجمالي الحجوزات.
   - تأكيد وإلغاء وتحديث حالات الحجوزات وطلبات عروض أسعار الشركات (B2B).
   - تعديل أسعار الرحلات (مصري/أجنبي) وتحديث حالة توافر المعدات والمقاعد.

---

## 9. قواعد العمل البرمجية (Business Rules)

تم توثيق وتخصيص أماكن القواعد المنصوص عليها في وثيقة المتطلبات SRS ضمن بنية الكود:

| قاعدة العمل (Business Rule) | الوصف الهندسي | موضع القاعدة في الكود |
| :--- | :--- | :--- |
| **الحد الأقصى للوزن (130 كجم)** | منع الحجز للمستخدمين ذوي الأوزان فوق 130 كجم لسلامة قوارب التجديف والـ SUP. | `src/shared/config/constants.js` |
| **سعة دراجة المياه (Water Bike = 2)** | سعة المعدة محددة بقطعتين فقط لكل فترة تشغيل، ويتم التحقق من عدم تجاوزها. | `src/entities/activity/model/activitiesData.js`<br>`src/entities/booking/lib/capacityValidator.js` |
| **سياسة الإلغاء (24 ساعة)** | الاسترداد الكامل مشروط بإلغاء الحجز قبل موعد النشاط بـ 24 ساعة على الأقل. | `src/shared/config/constants.js`<br>`src/entities/booking/lib/cancellationPolicy.js` |
| **الحد الأدنى للشركات (10 أفراد)** | استمارة B2B تشترط حدًا أدنى 10 أفراد لتقديم طلب عرض السعر المخصص. | `src/shared/config/constants.js`<br>`src/features/b2b-quote/ui/B2BQuoteForm.jsx` |
| **مواعيد العمل (الشروق إلى الغروب)** | فترات الأنشطة مرتبطة بساعات ضوء النهار وتتغير وفق الموسم وبيانات الـ API. | `src/entities/booking/lib/timeSlots.js` |

*(ملاحظة: ملفات المنطق مهيأة كبنية معمارية أساسية بانتظار اكتمال دوال التحقق).*

---

## 10. التعامل مع الـ API والبيانات الوهمية (API & Mocks)

- **عميل الشبكة الموحد:** يوجد في `src/shared/api/httpClient.js`، وهو مغلف موحد مبني على `fetch` يدير إرسال الترويسات (Headers)، وإلحاق رموز التفويض (Authorization Bearer Token)، والتعامل الموحد مع الأخطاء وإعادة المحاولة.
- **طبقة الخدمات (Entity Services):** كل كيان يمتلك خدمته الخاصة، مثل:
  - `src/entities/activity/api/activityService.js`
  - `src/entities/booking/api/bookingService.js`
  - `src/entities/quote/api/quoteService.js`
- **بيئة المحاكاة المحلية (Mocking):** داخل مجلد `src/shared/api/mocks/` يتوفر مجلد مخصص لمعالجات الـ Mock والبيانات التجريبية لتشغيل الواجهة وعرض الأنشطة وسيناريوهات الحجز محليًا بدون خادم.
- **ربط الواجهة بنظام الـ Backend الحقيقي:**
  1. إنشاء ملف `.env.local` في جذر المشروع وتحديد عنوان الخادم:
     ```env
     VITE_API_URL=https://api.duckegy.com/v1
     VITE_USE_MOCKS=false
     ```
  2. يقوم `src/shared/config/env.js` بتمرير العنوان تلقائيًا إلى `httpClient.js` لتوجه كافة الطلبات للـ API الحقيقي مباشرة.

---

## 11. نظام التصميم والتدويل (Design System & i18n)

### توكنز الهوية البصرية (Design Tokens)
توجد المتغيرات المركزية في ملف `src/shared/styles/tokens.css` والمستورد مباشرة في بداية `src/index.css`:
```css
:root {
  --color-navy: #121528;
  --color-blue: #067BA1;
  --color-yellow: #F5E847;
}
```

### التدويل وتعدد اللغات (i18n)
- ملفات النصوص والترجمة تقع داخل:
  - `src/shared/i18n/ar.json` (اللغة العربية الأساسية)
  - `src/shared/i18n/en.json` (اللغة الإنجليزية)
  - `src/shared/i18n/index.js` (إعداد وضبط مكتبة الترجمة وخيارات الـ Fallback)
- **إضافة نصوص جديدة:** يتم إضافة المفتاح والقيمة المقابلة في كلا الملفين `ar.json` و `en.json`.
- **التحكم في الاتجاه (RTL / LTR):** يتولى `src/app/providers/LanguageProvider.jsx` مراقبة اللغة الحالية وتحديث سمة `dir` على عنصر الجذر `document.documentElement` (`dir="rtl"` للغة العربية، و `dir="ltr"` للغة الإنجليزية).

---

## 12. اصطلاحات الكود والتسمية (Code Conventions)

- **مكونات الواجهة (Components):** تستخدم أسلوب **PascalCase** للملف والمكون (مثال: `ActivityCard.jsx`, `BookingModal.jsx`).
- **المجلدات والمسارات:** تستخدم أسلوب **kebab-case** للمجلدات متعددة الكلمات (مثال: `activity-details`, `guest-checkout`, `admin-management`).
- **الـ Hooks المخصصة:** تستخدم أسلوب **camelCase** وتبدأ دائمًا ببادئة `use` (مثال: `useCurrency.js`, `useBookingFlow.js`).
- **الملفات المساعدة والخدمات:** تستخدم أسلوب **camelCase** (مثال: `priceCalculator.js`, `activityService.js`).
- **هيكل مجلد المكون (Component Anatomy):**
  ```text
  Button/
  ├── Button.jsx   # كود المكون البرمجي
  └── Button.css   # التنسيقات الخاصة بالمكون فقط
  ```

---

## 13. بنية الاختبارات ومعايير القبول (Testing & Acceptance Criteria)

> **الحالة:** `[قيد الإضافة في كود tests/]`  
> مجلد `tests/` مقسم وفق أفضل الممارسات لاحتواء الاختبارات القادمة وربطها بمعايير القبول AC-01 إلى AC-06:

- `tests/unit/`: اختبارات دوال الحسابات والمنطق الصافي (`priceCalculator`, `capacityValidator`, `cancellationPolicy`).
- `tests/component/`: اختبارات تفاعل وسلوك المكونات المستقلة (`DualPriceSummary`, `StepGuestInfo`, `ProtectedRoute`).
- `tests/e2e/`: سيناريوهات الاختبار الشاملة لتجربة المستخدم (End-to-End) التي تغطي:
  - **AC-01:** حجز زائر ناجح ودفع إلكتروني.
  - **AC-02:** معالجة سيناريو فشل الدفع وإعادة المحاولة.
  - **AC-03:** حظر الوصول غير المصرح به لمسارات `/admin`.
  - **AC-04:** التحقق من سعة دراجة المياه في الموعد المختار.
  - **AC-05:** التحقق من الحد الأدنى لحجز الشركات (10 أفراد).
  - **AC-06:** التبديل اللحظي بين اللغتين وتوافق الاتجاهين RTL/LTR.

---

## 14. التوثيق والمراجع الهندسية (Documentation)

- **مجلد الوثائق الهندسية:** متوفر تحت مسار `docs/`.
- **المرجع المعتمد:** وثيقة متطلبات البرمجيات الرسمية **SRS (IEEE 29148 Standard) - v3.0**.
- **مصفوفة تتبع المتطلبات (RTM):** تغطي مطابقة المتطلبات الوظيفية FR-001 إلى FR-009 والمتطلبات غير الوظيفية NFR.

---

## 15. بيانات التواصل والمصدر الرسمي (Contact & Official Info)

- **الموقع الرسمي:** [https://www.duckegy.com/](https://www.duckegy.com/)
- **البريد الإلكتروني الرسمي:** [duck.asw@gmail.com](mailto:duck.asw@gmail.com)
- **المبادرة:** CreativeZ — Track: Tech & Web
- **شعار المشروع:** *"IN DUCK WE TRUST"* 🦆🌊
