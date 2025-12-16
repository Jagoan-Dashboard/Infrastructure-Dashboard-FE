// components/DashboardAdminLayout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/layout/dashboard/AppSidebar";
import Backdrop from "@/layout/dashboard/Backdrop";
import AppHeader from "@/layout/dashboard/AppHeader";

interface LayoutContentProps {
  children: ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --chat--message--font-size: 12px !important;
        --chat--input--font-size: 12px !important;
        --chat--heading--font-size: 14px !important;
        --chat--subtitle--font-size: 12px !important;
      }
      .chat-message-markdown {
        font-size: 12px !important;
      }
      .n8n-chat-ui-bot-message ol {
        list-style-type: decimal !important;
        list-style-position: outside !important;
        padding-left: 20px !important;
      }
    `;
    document.head.appendChild(style);

    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);


    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

    createChat({
        webhookUrl: 'https://dev-n8n.ub.ac.id/webhook/8339671d-75b1-4af4-8309-b2d776fd7715/chat',
        initialMessages: [
            'Selamat datang, **Bapak/Ibu Eksekutif**.\\nSaya Asisten Data AI Kab. Ngawi, siap menyediakan informasi cepat untuk data infrastruktur.'
        ],
        i18n: {
            en: {
                title: 'Jagoan Bot AI',
                subtitle: '',
                footer: '',
                getStarted: 'Mulai Sesi Percakapan dengan AI',
                inputPlaceholder: 'Input pertanyaan data Anda...',
            },
        },
        showWelcomeScreen: true,
        theme: {
            primaryColor: '#FF4B99',
            backgroundColor: '#FFFFFF',
            textColor: '#333333',
            chatBubbleColor: '#FFEDED'
        },
    });
    `;
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  });

  return (
    <div className="min-h-screen xl:flex bg-[#F8F3F5] xl:gap-4">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DashboardAdminLayoutProps {
  children: ReactNode;
}

const DashboardAdminLayout: React.FC<DashboardAdminLayoutProps> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default DashboardAdminLayout;