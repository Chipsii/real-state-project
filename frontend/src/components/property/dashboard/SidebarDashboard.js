"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/services/auth/api";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems = [
    {
      title: "MAIN",
      items: [
        { href: "/dashboard-home", icon: "flaticon-discovery", text: "Dashboard" },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        { href: "/dashboard-add-property", icon: "flaticon-new-tab", text: "Add New Property" },
        { href: "/dashboard-my-properties", icon: "flaticon-home", text: "My Properties" },
        // { href: "/dashboard-my-favourites", icon: "flaticon-like", text: "My Favorites" },
        // { href: "/dashboard-reviews", icon: "flaticon-review", text: "Reviews" },
      ],
    },
    // {
    //   title: "MANAGE ACCOUNT",
    //   items: [
    //     { href: "/dashboard-my-package", icon: "flaticon-protection", text: "My Package" },
    //     { href: "/dashboard-my-profile", icon: "flaticon-user", text: "My Profile" },
    //     // { href: "/login", icon: "flaticon-logout", text: "Logout" },
    //   ],
    // },
  ];

  const handleLogout = async () => {
    try {
      await adminLogout(); 
    } finally {
      router.replace("/login"); 
    }
  };

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p
              className={`fz15 fw400 ff-heading ${
                sectionIndex === 0 ? "mt-0" : "mt30"
              }`}
            >
              {section.title}
            </p>

            {section.items.map((item, itemIndex) => {
              const isActive = pathname === item.href;

              if (item.text === "Logout") {
                return (
                  <div key={itemIndex} className="sidebar_list_item">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="items-center w-100 text-start bg-transparent border-0"
                    >
                      <i className={`${item.icon} mr15`} />
                      Logout
                    </button>
                  </div>
                );
              }

              return (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center ${isActive ? "-is-active" : ""}`}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
