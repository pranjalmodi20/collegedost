"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { megaMenuItems, MegaMenuLink } from '@/data/megaMenuData';
import {
  FaBars,
  FaChevronDown,
  FaAngleRight,
  FaTimes,
  FaChartPie,
  FaUniversity,
  FaNewspaper,
  FaUserShield,
  FaArrowLeft,
  FaSearch,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ──────────────────────────────────────────────────────────
// Navbar Component — 3-level Shiksha-style mega menu
// ──────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();
  const pathname = usePathname();
  const isAdminMode = pathname?.startsWith('/admin') || false;

  /* ── Desktop state ── */
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [activeSubIdx, setActiveSubIdx] = useState<number>(0);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ── Mobile state ── */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileMenuIdx, setMobileMenuIdx] = useState<number | null>(null);
  const [mobileSubIdx, setMobileSubIdx] = useState<number | null>(null);

  /* ── User dropdown ── */
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  /* ── Search state ── */
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Desktop hover handlers ────────────────────────────
  const openMenu = useCallback((idx: number) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveMenu(idx);
    setActiveSubIdx(0);
  }, []);

  const scheduleClose = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubIdx(0);
    }, 180);
  }, []);

  const cancelClose = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  }, []);

  const closeAll = useCallback(() => {
    setActiveMenu(null);
    setActiveSubIdx(0);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
        dropdownTimeout.current = null;
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
    setMobileMenuIdx(null);
    setMobileSubIdx(null);
  };

  // ─── Admin links ───────────────────────────────────────
  const adminLinks = [
    { title: 'Dashboard', href: '/admin', icon: FaChartPie },
    { title: 'Colleges', href: '/admin/colleges', icon: FaUniversity },
    { title: 'Articles', href: '/admin/articles', icon: FaNewspaper },
    { title: 'Users', href: '/admin/users', icon: FaUserShield },
  ];

  // ─── Render a single Level-3 link ──────────────────────
  const renderL3Link = (link: MegaMenuLink, idx: number, onClick?: () => void) => {
    if (link.isHeader) {
      return (
        <li key={idx} className="mb-1.5 mt-4 first:mt-0">
          <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-1 block">
            {link.label}
          </span>
        </li>
      );
    }
    return (
      <li key={idx}>
        <Link
          href={link.href}
          onClick={onClick}
          className={`text-[13px] leading-relaxed block py-0.75 transition-colors ${
            link.isViewAll
              ? 'text-primary font-semibold mt-1.5 hover:underline'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          {link.label}
        </Link>
      </li>
    );
  };

  // ═══════════════════════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════════════════════
  return (
    <nav
      className={`sticky top-0 z-50 ${
        isAdminMode
          ? 'bg-slate-900 border-b border-slate-800'
          : 'bg-white border-b border-gray-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ────── ROW 1: Logo + Search + Auth ────── */}
        <div className="flex items-center justify-between h-14 border-b border-gray-100">
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="lg:hidden text-gray-500 text-xl"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>

            <Link href="/" className="flex items-center gap-2">
              {isAdminMode ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white">
                    <FaUserShield className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-lg text-white">
                      Admin Panel
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <FaArrowLeft className="text-[8px]" /> Back to Site
                    </span>
                  </div>
                </div>
              ) : (
                <span className="font-display font-bold text-2xl tracking-tight text-primary">
                  COLLEGE DOST
                </span>
              )}
            </Link>
          </div>

          {/* CENTER: Search Bar */}
          {!isAdminMode && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search colleges, exams, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>
            </div>
          )}

          {/* RIGHT: Auth Buttons / User Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {!user ? (
              <>
                <button
                  onClick={openAuthModal}
                  className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Login
                </button>
                <button
                  onClick={openAuthModal}
                  className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 border px-3 py-1.5 rounded-full transition-colors ${
                    isAdminMode
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary/30'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm bg-primary text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium hidden md:block max-w-25 truncate">
                    {user?.name || 'Guest'}
                  </span>
                  <FaChevronDown className="text-xs text-gray-400" />
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 z-50 ${
                        isAdminMode
                          ? 'bg-slate-800 border-slate-700'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div
                        className={`px-4 py-3 border-b ${
                          isAdminMode ? 'border-slate-700' : 'border-gray-100'
                        }`}
                      >
                        <p
                          className={`text-sm font-bold truncate ${
                            isAdminMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {user.name}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isAdminMode ? 'text-slate-400' : 'text-gray-500'
                          }`}
                        >
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className={`block px-4 py-2.5 text-sm ${
                          isAdminMode
                            ? 'text-slate-300 hover:bg-slate-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Profile Settings
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className={`block px-4 py-2.5 text-sm ${
                            isAdminMode
                              ? 'text-slate-300 hover:bg-slate-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2.5 text-sm ${
                          isAdminMode
                            ? 'text-red-400 hover:bg-slate-700'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ────── ROW 2: Menu Items (centered) ────── */}
        {!isAdminMode && (
          <div className="hidden lg:flex items-center justify-center h-12">
            {megaMenuItems.map((item, idx) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => openMenu(idx)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors ${
                    activeMenu === idx
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {item.title}
                  <FaChevronDown
                    className={`text-[8px] opacity-60 transition-transform duration-200 ${
                      activeMenu === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ────── Admin Nav (desktop, admin mode) ────── */}
        {isAdminMode && (
            <div className="hidden lg:flex items-center justify-center gap-6 h-12 border-t border-slate-700">
              {adminLinks.map((link) => {
                const isActive =
                  link.href === '/admin'
                    ? pathname === '/admin'
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <link.icon className={isActive ? 'text-primary' : ''} />
                    {link.title}
                  </Link>
                );
              })}
            </div>
          )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP MEGA-MENU DROPDOWN (Level 2 sidebar + Level 3 content)
         ═══════════════════════════════════════════════════════════ */}
      {!isAdminMode && activeMenu !== null && (
        <div
          className="absolute left-0 right-0 top-full z-40"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="max-w-4xl mx-auto px-4">
            <div
              className="bg-white shadow-2xl rounded-b-xl border border-t-0 border-gray-100 overflow-hidden flex"
              style={{ maxHeight: '480px' }}
            >
              {/* ── Level 2: Sidebar ── */}
              <div className="w-55 bg-gray-50/80 border-r border-gray-100 overflow-y-auto shrink-0 py-1">
                {megaMenuItems[activeMenu].subcategories.map((sub, sIdx) => {
                  const isActive = activeSubIdx === sIdx;
                  const hasContent = sub.columns.length > 0;

                  // Direct-link item with no submenu
                  if (sub.directLink && !hasContent) {
                    return (
                      <Link
                        key={sIdx}
                        href={sub.directLink}
                        onClick={closeAll}
                        onMouseEnter={() => setActiveSubIdx(sIdx)}
                        className={`flex items-center justify-between px-5 py-2.5 text-[13px] font-medium transition-all ${
                          isActive
                            ? 'text-primary bg-white border-l-[3px] border-primary'
                            : 'text-gray-700 hover:text-primary border-l-[3px] border-transparent'
                        }`}
                      >
                        {sub.title}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={sIdx}
                      onMouseEnter={() => setActiveSubIdx(sIdx)}
                      className={`flex items-center justify-between px-5 py-2.5 text-[13px] font-medium cursor-default transition-all ${
                        isActive
                          ? 'text-primary bg-white border-l-[3px] border-primary'
                          : 'text-gray-700 hover:text-primary border-l-[3px] border-transparent'
                      }`}
                    >
                      <span>{sub.title}</span>
                      {hasContent && (
                        <FaAngleRight className="text-[10px] opacity-40" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Level 3: Content columns ── */}
              <div className="flex-1 p-6 overflow-y-auto">
                {(() => {
                  const sub =
                    megaMenuItems[activeMenu].subcategories[activeSubIdx];
                  if (!sub || sub.columns.length === 0) return null;
                  const colCount = sub.columns.length;
                  return (
                    <div
                      className={`grid gap-8 ${
                        colCount >= 3
                          ? 'grid-cols-3'
                          : colCount === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-1'
                      }`}
                    >
                      {sub.columns.map((col, cIdx) => (
                        <ul key={cIdx} className="space-y-0">
                          {col.links.map((link, lIdx) =>
                            renderL3Link(link, lIdx, closeAll)
                          )}
                        </ul>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MOBILE SIDEBAR MENU
         ═══════════════════════════════════════════════════════════ */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-999 lg:hidden"
            onClick={closeMobile}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-screen w-[85%] max-w-100 bg-white z-1000 lg:hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-display font-bold text-xl text-primary">
                COLLEGE DOST
              </span>
              <button
                onClick={closeMobile}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Close menu"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {megaMenuItems.map((item, mIdx) => (
                <div key={mIdx} className="border-b border-gray-50">
                  {/* Level 1 */}
                  <button
                    onClick={() => {
                      setMobileMenuIdx(mobileMenuIdx === mIdx ? null : mIdx);
                      setMobileSubIdx(null);
                    }}
                    className="flex items-center justify-between w-full px-5 py-3.5 text-left text-gray-800 font-semibold text-[15px]"
                  >
                    {item.title}
                    <FaChevronDown
                      className={`text-xs text-gray-400 transition-transform duration-200 ${
                        mobileMenuIdx === mIdx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Level 2 (subcategories) */}
                  {mobileMenuIdx === mIdx && (
                    <div className="bg-gray-50/60">
                      {item.subcategories.map((sub, sIdx) => {
                        const hasContent = sub.columns.length > 0;

                        // Direct-link item without sub-content
                        if (!hasContent && sub.directLink) {
                          return (
                            <Link
                              key={sIdx}
                              href={sub.directLink}
                              onClick={closeMobile}
                              className="block px-8 py-2.5 text-sm text-gray-600 hover:text-primary"
                            >
                              {sub.title}
                            </Link>
                          );
                        }

                        if (!hasContent) return null;

                        return (
                          <div key={sIdx}>
                            <button
                              onClick={() =>
                                setMobileSubIdx(
                                  mobileSubIdx === sIdx ? null : sIdx
                                )
                              }
                              className="flex items-center justify-between w-full px-8 py-2.5 text-left text-sm text-gray-700 font-medium"
                            >
                              {sub.title}
                              <FaAngleRight
                                className={`text-[10px] text-gray-400 transition-transform duration-200 ${
                                  mobileSubIdx === sIdx ? 'rotate-90' : ''
                                }`}
                              />
                            </button>

                            {/* Level 3 (links) */}
                            {mobileSubIdx === sIdx && (
                              <div className="bg-white px-10 py-2 space-y-0.5">
                                {sub.columns
                                  .flatMap((col) => col.links)
                                  .map((link, lIdx) => {
                                    if (link.isHeader) {
                                      return (
                                        <div
                                          key={lIdx}
                                          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-3 pb-1 first:pt-0"
                                        >
                                          {link.label}
                                        </div>
                                      );
                                    }
                                    return (
                                      <Link
                                        key={lIdx}
                                        href={link.href}
                                        onClick={closeMobile}
                                        className={`block py-1 text-[13px] transition-colors ${
                                          link.isViewAll
                                            ? 'text-primary font-semibold'
                                            : 'text-gray-600 hover:text-primary'
                                        }`}
                                      >
                                        {link.label}
                                      </Link>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            {!user && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    closeMobile();
                    openAuthModal();
                  }}
                  className="w-full py-3 bg-primary text-white font-medium rounded-full"
                >
                  Login / Signup
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
