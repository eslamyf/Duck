# 🦆 Duck — Water Sports & Marine Activities Platform

[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Design Tokens](https://img.shields.io/badge/Brand-In%20Duck%20We%20Trust-F5E847)](https://www.duckegy.com/)

منصة ويب عصرية وتفاعلية لحجز الأنشطة والتجارب المائية في مصر (Kayak, SUP, Water Bike)، بشعارها الرسمي **"IN DUCK WE TRUST"**. تم بناء الواجهة وفق معمارية **Feature-Sliced Design (FSD)** ومجهزة بنظام تسعير مزدوج (مصري/أجنبي)، وحجز كزائر، ودعم ثنائي اللغة والعملة.

---

## 1. نظرة عامة (Overview)

تهدف منصة **Duck** إلى التطوير الشامل وتوسيع النشاط ليصبح **منصة مصرية متكاملة لحجز الأنشطة والتجارب المائية في مصر** (تدعم B2C وB2B وتسمح بإضافة مقدمي خدمات ووجهات جديدة من لوحة التحكم بدون تعديل الكود)، وذلك من خلال تجربة **Mobile-First** سريعة وعصرية تستهدف الزوار المحليين والسياح الأجانب والمنظمات.

- **نطاق العمل (In-Scope):** تطبيق واجهة أمامية كامل (Frontend Web Application) يغطي تجربة العميل (B2C) من الاستكشاف حتى الدفع الإلكتروني، والتذاكر الرقمية (`QR Code` وإدارة الحجز)، ومنظومة B2B المزدوجة (باقات جاهزة + طلبات عروض أسعار مخصصة)، ولوحة التحكم متعددة الأدوار (6 أدوار وفق **RBAC**)، ومنظومة التتبع والتحليلات (`GA4`, `GTM`, `Meta Pixel`, `CAPI`).
- **خارج نطاق العمل (Out-of-Scope):** بناء خوادم وقواعد بيانات الـ Backend، وبوابات الدفع البنكية الفعلية، وتعديل الموقع الحالي أو قاعدة البيانات والاستضافة قبل مراجعة البنية الحالية وتجهيز واختبار خطة **النسخ الاحتياطي والاسترداد (Backup & Recovery)**.
- **المرجع الهندسي المعتمد:** مواصفات متطلبات البرمجيات وفق معيار **IEEE 29148 (الإصدار 3.1 بتاريخ 16 نوفمبر 2026)** المتزامنة مع وثيقة **التوجه الاستراتيجي النهائي للعميل (`DUCK____Answers___Strategic_Direction.pdf`)** — مبادرة **CreativeZ** (فريق Tech & Web Track).
- **ترتيب الأولويات الاستراتيجية المعتمدة:**
  1. تحسين معدل التحويل (**CRO**)
  2. تجربة الحجز (**Booking Experience**)
  3. الأداء والـ **SEO**
  4. إدارة مقدمي الخدمات (**Provider Management**)
  5. قابلية التوسع (**Scalability**)
  6. التحليلات والقرارات المبنية على البيانات (**Analytics & Data-Driven Decisions**)
- **الهوية البصرية الرسمية:**
  - **Navy (الكحلي الداكن):** `#121528` (مرجع PDF: `#0C1226`)
  - **Blue (الأزرق المائي):** `#067BA1` (مرجع PDF: `#147D9F`)
  - **Yellow (الأصفر المميز):** `#F5E847` (مرجع PDF: `#FDFB45`)
  - **الاتجاه البصري:** **Premium, Minimal & Modern** — Editorial Marine / Sea-Inspired (ظلال ناعمة، حدود شعرية تيل، زجاج مموّه، تصوير حقيقي من عمليات DUCK فقط، وحركات Micro-Animations خفيفة دون التأثير على السرعة). المرجع: `../FinalDesign/Final_4.html`.
- **أهم الميزات:**
  - تسعير مزدوج واضح وشفاف على كل بطاقة (سعر المصري مقابل سعر الزائر الأجنبي)، مع **الجنيه المصري (`EGP`) كعملة أساسية للحسابات والدفع** وعرض العملات الأخرى (`USD` / `EUR`) كقيم استرشادية فقط.
  - مسار حجز سريع كزائر (Guest Checkout) بدون إجبار على التسجيل المسبق، وتأكيد فوري يتضمن رقم الحجز، **QR Code**، تعليمات الوصول، وإشعارات واتساب وإيميل، مع دعوة لإنشاء حساب بضغطة زر.
  - نظام **طاقة استيعابية وتوافر مواعيد (Inventory & Availability)** لمنع تضارب المواعيد (Kayak = `20` وحدة، Water Bike = `2` وحدتين، SUP قابل للتخصيص).
  - باقات **B2B هجينة ومستقلة** (باقات جاهزة للأعداد المتكررة + نموذج Request a Quote للشركات والمدارس والجامعات والفنادق والمرشدين ومنظمي الرحلات والفعاليات).
  - **بانر مخصص وصفحة تفاعلية مبدعة لحجز المجموعات والفعاليات (`#/groups`):** غلاف بانر مموج طبيعي (Organic Wavy Cover) في الصفحة الرئيسية بصورة عمليات حقيقية وواضحة للمشاركين (`HSXR5504.JPG`)، ينقل المستخدم عند الضغط إلى **صفحة حجز المجموعات التفاعلية** (`#groupsPage` / `#/groups`) تحت **نفس شريط التنقل الرئيسي المثبّت دائماً (`header.nv`)**، مع معرض صور علوي (Bento Gallery) ونموذج تفاعلي مبسّط من خطوتين (اختيار تفاصيل الرحلة والعدد بدءاً من 20 فرد + بيانات التواصل) مع معرض صور جماعية حقيقي ورابط الرئيسية في النافبار المثبّتة مع **بطاقة رحلة حية (Live Group Pass)** تظهر لحظياً وتُصدر الحجز عبر واتساب دون استخدام مصطلح B2B في واجهة المستخدم.
  - **صفحة «من نحن» السينمائية المستقلة بالكامل (`#/about`):** تحويل صفحة «من نحن» إلى تجربة سينمائية غامرة بخلفية كاملة الامتداد (Full-Bleed Photographic Background) من واقع نيل أسوان (`HSXR5504.JPG` / `GUQJ8589.JPG`) مع طبقة فيجنيت فنية، وبطاقات زجاجية فاخرة (Frosted Glassmorphism)، وعرض أرقام المنصة المعتمدة (+4,000 مغامر، 5 وجهات، 100% أمان، 24h مرونة إلغاء)، وبوابتي الرؤية والرسالة المتألقتين، وركائز التميز الأربعة، وشريط صور ميداني حقيقي، والالتزام بأهداف التنمية المستدامة (`UN SDGs 8, 9, 11, 17`) تحت شريط التنقل الرئيسي الثابت (`header.nv`) وبأعلى كفاءة وسرعة استجابة.
- دعم **Arabic (RTL)** و**English (LTR)** عند الإطلاق مع بنية قابلة للتوسع مستقبلاً لـ **German, French, Russian**.

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
| `/login` | `LoginPage` (Split-Screen: `Customer` / `Partner` فقط) | `pages/auth` | Public (نوعان فقط) |
| `/#/portal/admin` (وما يماثله للطاقم) | بوابة كلمة مرور مباشرة بدون واجهة عامة (`#staffGate`) | `pages/admin` | Staff Only (باسورد مخصص) |
| `/admin/dashboard` | `AdminDashboardPage` (لوحة كلاسيكية بقائمة جانبية حسب اللغة) | `pages/admin` | Admin فقط |
| `/admin/bookings` | `AdminBookingsPage` | `pages/admin` | Admin فقط |
| `/admin/quotes` | `AdminQuotesPage` | `pages/admin` | Admin فقط |
| `/admin/activities` | `AdminActivitiesPage` | `pages/admin` | Admin فقط |
| `*` | `NotFoundPage` | `pages/not-found` | Public (404) |

---

## 8. الأدوار والصلاحيات وفصل بوابات الدخول (Auth & 6-Role RBAC)

- **شاشة الدخول العامة (Split-Screen):** مخصصة لنوعين فقط (**مستخدم / عميل `Customer`** أو **مزود خدمة `Partner`**) بتصميم مقسوم، مع **منع عرض أي قائمة تبديل أدوار (`RBAC Role Switcher`) للجمهور**.
- **روابط الدخول الخاصة بالطاقم (Password-Only Direct Routes):** الأدوار الداخلية (`Admin`, `Operations`, `TourGuide`, `ContentManager`, `B2B`) لا تظهر في واجهة الموقع، ولكل منها رابط مباشر (`#/portal/admin`, `#/portal/ops`, `#/portal/guide`, `#/portal/content`, `#/portal/b2b`) يفتح شاشة معزولة تطلب كلمة المرور الخاصة فقط بدون أي قوائم عامة.
- **الداشبورد الكلاسيكية (`Classic Sidebar Dashboard`):** قائمة جانبية عمودية تتبدل تلقائياً حسب اللغة (**يمين** في العربية `RTL`، و**يسار** في الإنجليزية `LTR`).
- **الأدوار الستة وإدارة الصلاحيات من لوحة الأدمن (`AuthProvider.jsx` / `ProtectedRoute.jsx`):**

1. **العميل / الزائر (`Customer / Guest`):** تصفح الأنشطة، اختيار الرحلات، الحجز والدفع السريع كزائر (`Guest Checkout`)، أو متابعة الحجوزات والتذاكر (`QR Code`) وإدارة الحساب عبر `/my-bookings`.
2. **الإدارة العامة (`Admin`):** إدارة كاملة للموقع، الحجوزات (بكل حالاتها الست: `Pending, Confirmed, Paid, Completed, Cancelled, Refunded`)، العملاء، الأسعار، الأنشطة، المحتوى، ومقدمي الخدمات، مع تخصيص صلاحيات كل مستخدم.
3. **مقدم الخدمة / الشريك (`Service Provider / Partner`):** إدارة الخدمات الخاصة به فقط، الأسعار المتفق عليها، المواعيد المتاحة، الطاقة الاستيعابية لمعداته، ومتابعة حجوزاته فقط.
4. **فريق التشغيل (`Operations Team`):** متابعة الحجوزات، تأكيد التنفيذ (`Confirmed -> Completed`)، وإدارة المواعيد وتوافر المعدات دون تعديل إعدادات مالية عليا.
5. **المرشد السياحي / وكيل الحجز (`Tour Guide / Agent`):** إنشاء ومتابعة طلبات الحجز الخاصة بالعملاء أو المجموعات (`B2B`) وفق الصلاحيات الممنوحة له.
6. **مدير المحتوى (`Content Manager`):** إدارة المحتوى، الصور الحقيقية، الوصف، والعروض دون أي صلاحيات مالية أو إدارية حساسة.

---

## 9. قواعد العمل البرمجية (Business Rules)

| قاعدة العمل (Business Rule) | الوصف الهندسي | موضع القاعدة في الكود |
| :--- | :--- | :--- |
| **الطاقة الاستيعابية والمخزون (`Inventory`)** | **Kayak: 20 وحدة**، **Water Bike: وحدتان فقط (`2`)**، **SUP: قابل للتخصيص** — نظام `Availability & Inventory` يمنع تضارب المواعيد والحجز الزائد، ويُدار لكل مقدم خدمة ونشاط وموعد. | `src/entities/activity/model/activitiesData.js`<br>`src/entities/booking/lib/capacityValidator.js` |
| **الحد الأقصى للوزن (130 كجم)** | الحد الأقصى لوزن المشارك `130` كجم؛ والسباحة غير مطلوبة مع توفير سترات نجاة معتمدة. | `src/shared/config/constants.js` |
| **الحجز كزائر + تدفق ما بعد الحجز** | تأكيد فوري برقم مرجعي + **QR Code** + واتساب وإيميل + صفحة إدارة الحجز + حالات `Pending, Confirmed, Paid, Completed, Cancelled, Refunded`. | `src/entities/booking/lib/cancellationPolicy.js`<br>`src/features/post-booking-account/` |
| **سياسة الإلغاء والتعديل (24 ساعة)** | استرداد 100% قبل النشاط بـ 24 ساعة على الأقل وتُعرض السياسة للعميل بوضوح قبل الدفع. | `src/entities/booking/lib/cancellationPolicy.js` |
| **منظومة B2B الهجينة (`>= 10`)** | جمع بين **باقات جاهزة بأسعار واضحة** + **Request a Quote** للشركات والمدارس والجامعات والفنادق والمرشدين ومنظمي الرحلات والفعاليات مع دعم العمولات وشروط التعاقد. | `src/shared/config/constants.js`<br>`src/features/b2b-quote/ui/B2BQuoteForm.jsx` |
| **مواعيد العمل (الشروق إلى الغروب)** | فترات الأنشطة مرتبطة بساعات ضوء النهار وتتغير وفق التوافر التشغيلي. | `src/entities/booking/lib/timeSlots.js` |
| **العملة الأساسية واللغات** | التسجيل والمحاسبة والدفع الأساسي بعملة **EGP** (`USD`/`EUR` عرض استرشادي فقط)، واللغات الأساسية `AR`/`EN` مع قابلية التوسع إلى `DE, FR, RU`. | `src/shared/i18n/`<br>`src/shared/hooks/useCurrency.js` |
| **منظومة التتبع والتحليلات (8 أحداث)** | ربط **GA4** و**GTM** و**Meta Pixel** و**Meta CAPI** لتتبع: `Page View`, `View Activity`, `Search`, `Initiate Booking`, `Add Booking Details`, `Initiate Checkout`, `Purchase`, `Lead Submission`. | `src/shared/lib/analytics.js` |

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

### توكنز الهوية البصرية (Design Tokens — Refined Nile & Sea Aesthetic)
توجد المتغيرات المركزية في ملف `src/shared/styles/tokens.css` والمستورد مباشرة في بداية `src/index.css` (وفق التوجيه البصري المعتمد في `Final_4.html` و `AGENTS.md`: ظلال محيطية ناعمة، حدود زجاجية شفافة، زوايا `20px–24px`، وبدون أنماط كرتونية):
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

## 14. التوثيق والمراجع الهندسية (Documentation & Agent Rules)

- **دستور الوكلاء والمعمارية (`AGENTS.md`):** ملف [`AGENTS.md`](./AGENTS.md) في جذر المشروع هو المرجع الإلزامي الأول لأي مطور أو وكيل ذكاء اصطناعي قبل كتابة أو تعديل أي كود.
- **قاعدة التحديث الفوري للوثائق (Living `.md` Sync):** عند إجراء أي تعديل معماري أو إضافة قاعدة عمل أو مكون جديد، يجب تحديث كافة ملفات `.md` في المستودع (`AGENTS.md`, `README.md`, `duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`, ومجلد `docs/`) فورًا لضمان التطابق الكامل.
- **الأولوية القصوى لتجربة الموبايل وواجهة المستخدم (Mobile-First UI/UX Priority):** تُعد تجربة الهاتف المحمول (`309px - 900px`) وجودة التصميم المتجاوب (Responsive Design) وسهولة الاستخدام الركيزة الأساسية الأولى:
  - **Single Top Navbar on Mobile:** إخفاء الشريط العلوي المظلم (`.top`) تماماً على الموبايل ليصبح النافبار الأبيض الأنيق (`.nr` بارتفاع ~52px) هو الشريط الوحيد في أعلى الشاشة حاملاً الشعار وزر الحجز وقائمة الهامبرغر، مع نقل محولات اللغة والعملات والطقس لأعلى الدرج المنزلق (`.mnav`).
  - **Compact Bottom Dock:** تقليص شريط التنقل السفلي (`.dock`) إلى ارتفاع مدمج (~42px - 45px) لتوفير أقصى مساحة عرض عمودية على الشاشات الصغيرة.
  - **Font Awesome 6 Standard:** توحيد جميع الأيقونات التفاعلية في الموقع (أيقونات الشريط السفلي، الواتساب، التقييمات، القوائم الجانبية، أزرار الإغلاق وكشف كلمة المرور) بأيقونات Vector حديثة من مكتبة Font Awesome 6.
  - **Card Compactness & Text Ordering:** تنظيم كروت التقييمات بحيث تصبح بيانات كاتب التقييم والتاريخ والرحلة وشارة Google في سطر متناسق منظم دون أن تمط الكارد للأسفل، وضبط كروت الوجهات في قسم الخريطة لتظهر بصور واضحة ونصوص مقروءة على سطرين دون قطع بالنقاط.
  - **Enterprise Nile & Sea Footer:** فوتر احترافي متكامل من 4 أعمدة (عن المنصة وروابط التواصل، الروابط السريعة، الوجهات وفروع مصر، بيانات التواصل المباشر وشارات الأمان والإلغاء المجاني).
- **مجلد الوثائق الهندسية:** متوفر تحت مسار `docs/`.
- **المرجع المعتمد:** وثيقة متطلبات البرمجيات الرسمية **SRS (IEEE 29148 Standard) - v3.1** المتزامنة مع وثيقة العميل النهائية **`DUCK____Answers___Strategic_Direction.pdf`**.
- **مصفوفة تتبع المتطلبات (RTM):** تغطي مطابقة المتطلبات الوظيفية FR-001 إلى FR-009 والمتطلبات غير الوظيفية NFR.

---

## 15. بيانات التواصل والمصدر الرسمي (Contact & Official Info)

- **الموقع الرسمي:** [https://www.duckegy.com/](https://www.duckegy.com/)
- **البريد الإلكتروني الرسمي:** [duck.asw@gmail.com](mailto:duck.asw@gmail.com)
- **المبادرة:** CreativeZ — Track: Tech & Web
- **شعار المشروع:** *"IN DUCK WE TRUST"* 🦆🌊
