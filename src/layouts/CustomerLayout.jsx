import { useState } from "react";
import { Outlet } from "react-router-dom";

import CustomerSidebar from "../widgets/customer-dashboard/CustomerSidebar";
import CustomerHeader from "../widgets/customer-dashboard/CustomerHeader";
import { useTranslation } from "../shared/i18n/index.js";

function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { lang } = useTranslation();
  const isArabic = lang === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#F5F6F8] text-[#0C1226]"
    >
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <CustomerSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <CustomerHeader
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1500px]">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;