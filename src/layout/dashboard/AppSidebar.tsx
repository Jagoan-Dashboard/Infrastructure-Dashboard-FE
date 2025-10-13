// components/AppSidebar.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
// import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { assets } from "@/assets/assets";

type SubMenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  pro?: boolean;
  new?: boolean;
  // permission?: PermissionType;
};

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: SubMenuItem[];
  isLogout?: boolean;
  isHelp?: boolean;
  // permission?: PermissionType;
  // permissions?: PermissionType[];
};

const mainNavItems: NavItem[] = [
  {
    icon: (
      <Icon icon="mynaui:building" width="20" height="20" color="#3355FF" />
    ),
    name: "Tata Bangunan",
    path: "/dashboard-admin",
    // permission: PERMISSIONS.DASHBOARD_INDEX,
  },
  {
    icon: (
      <Icon
        icon="fluent:data-area-32-regular"
        width="20"
        height="20"
        color="#3355FF"
      />
    ),
    name: "Tata Ruang",
    path: "/dashboard-admin/tata-ruang",
    // permission: PERMISSIONS.DASHBOARD_INDEX,
  },
  {
    icon: (
      <Icon
        icon="material-symbols:water-pump-outline-rounded"
        width="20"
        height="20"
        color="#3355FF"
      />
    ),
    name: "Sumber Daya Air",
    path: "/dashboard-admin/sumber-daya-air",
    // permission: PERMISSIONS.DASHBOARD_INDEX,
  },
  {
    icon: (
      <Icon
        icon="icon-park-outline:road"
        width="20"
        height="20"
        color="#3355FF"
      />
    ),
    name: "Binamarga",
    path: "/dashboard-admin/binamarga",
    // permission: PERMISSIONS.DASHBOARD_INDEX,
  },
];

const bottomNavItems: NavItem[] = [
  {
    name: "Bantuan",
    isHelp: true, // Menandai sebagai menu bantuan
  },
  {
    icon: <Icon icon="tabler:logout-2" width="20" height="20" color="" />,
    name: "Logout",
    path: "/logout",
    isLogout: true,
    // permission: PERMISSIONS.DASHBOARD_INDEX,
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  // const { logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "bottom";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // confirmDialog({
    //   message: "Apakah kamu yakin ingin logout?",
    //   header: "Konfirmasi Logout",
    //   icon: "pi pi-exclamation-triangle",
    //   acceptLabel: "Ya, Logout",
    //   rejectLabel: "Batal",
    //   acceptClassName: "p-button-danger",
    //   accept: async () => {
    //     try {
    //       await logout();
    //     } catch (error) {
    //       console.error("Logout gagal", error);
    //     }
    //   },
    // });
  }, []);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others" | "bottom") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const getSubMenuItemIcon = (subItem: SubMenuItem) => {
    return subItem?.icon || <HiDotsHorizontal className="w-4 h-4" />;
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others" | "bottom") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const accessibleSubItems =
          nav.subItems?.map((subItem) => subItem) || [];

        if (nav.subItems) {
          if (accessibleSubItems.length === 0) return null;

          const isOpen =
            openSubmenu?.type === menuType && openSubmenu?.index === index;
          const isCurrent = isOpen || isActive(nav.path || "");

          return (
            <li key={nav.name} className="relative">
              <button
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group
                  ${
                    isCurrent
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  ${
                    !isExpanded && !isHovered && !isMobileOpen
                      ? "justify-center"
                      : "justify-between"
                  }
                `}
                onClick={() => handleSubmenuToggle(index, menuType)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 group-hover:text-blue-800">
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </div>
                {(isExpanded || isHovered || isMobileOpen) && nav.subItems && (
                  <FaChevronDown
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: isOpen
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {accessibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-200
                            ${
                              isActive(subItem.path)
                                ? "text-blue-700 bg-blue-50"
                                : "text-gray-600 hover:bg-gray-100"
                            }
                          `}
                        >
                          <span className="text-blue-600">
                            {getSubMenuItemIcon(subItem)}
                          </span>
                          <span>{subItem.name}</span>
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isActive(subItem.path)
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isActive(subItem.path)
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        }
        if (nav.isHelp) {
          return (
            <li key={nav.name} className="relative">
              <div
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-gray-600 hover:bg-gray-100
                ${
                  !isExpanded && !isHovered && !isMobileOpen
                    ? "justify-center"
                    : "justify-between"
                }
              `}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">{nav.icon}</span>
                      <div>
                        <h3 className="font-medium">Butuh Bantuan?</h3>
                        <p className="text-xs text-gray-500">Hubungi kami</p>
                      </div>
                    </div>
                    <div
                      className="border-1 border-gray-300 rounded-lg p-2 "
                      onClick={() => {
                        // Handle bantuan action
                        console.log("Bantuan clicked");
                      }}
                    >
                      <Icon
                        icon="mynaui:telephone"
                        width="16"
                        height="16"
                        className="text-blue-600"
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-blue-600">{nav.icon}</span>
                )}
              </div>
            </li>
          );
        }
        if (nav.path) {
          return nav.isLogout ? (
            <li key={nav.name}>
              <button
                className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${
                    isActive(nav.path)
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  ${
                    !isExpanded && !isHovered && !isMobileOpen
                      ? "justify-center"
                      : "justify-start"
                  }
                `}
                onClick={handleLogout}
              >
                <span className="text-orange-600">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-orange-600">{nav.name}</span>
                )}
              </button>
            </li>
          ) : (
            <li key={nav.name}>
              <Link
                href={nav.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${
                    isActive(nav.path)
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  ${
                    !isExpanded && !isHovered && !isMobileOpen
                      ? "justify-center"
                      : "justify-start"
                  }
                `}
              >
                <span className="text-blue-600">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{nav.name}</span>
                )}
              </Link>
            </li>
          );
        }
        return null;
      })}
    </ul>
  );

  return (
    <div
      className={`fixed h-full top-0 p-5 z-50  lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <aside
        className={`  bg-white flex flex-col lg:mt-0  px-5 left-0  h-[calc(100vh-45px)] text-gray-900  overflow-y-auto transition-all duration-300 ease-in-out z-50 rounded-xl
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[80px]"
        }
        lg:translate-x-0`}
      >
        <div
          className={`py-8 flex ${
            !isExpanded && !isHovered && !isMobileOpen
              ? "lg:justify-center"
              : "justify-start"
          }`}
        >
          <Link href="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <div className=" flex justify-center items-center gap-2">
                  <Image
                    src={assets.imageLogoNgawi}
                    alt="Logo Ngawi"
                    width={30}
                    height={30}
                  />
                  <Image
                    src={assets.imageLogo}
                    alt="Logo Jagoan Satu Data"
                    width={120}
                    height={120}
                  />
                </div>
              </>
            ) : (
              <Image
                src={assets.imageLogoNgawi}
                alt="Logo Ngawi"
                width={30}
                height={30}
              />
            )}
          </Link>
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered && !isMobileOpen
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Menu"
                  ) : (
                    <HiDotsHorizontal className="size-6" />
                  )}
                </h2>
                {renderMenuItems(mainNavItems, "main")}
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom navigation items */}
        <div className="mt-auto pb-4">
          <nav>{renderMenuItems(bottomNavItems, "bottom")}</nav>
        </div>
      </aside>
    </div>
  );
};

export default AppSidebar;
