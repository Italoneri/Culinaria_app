import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const IconHome = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export const IconHomeFill = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
    <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" fill="currentColor"/>
  </svg>
);

export const IconBook = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M4 4.5A1.5 1.5 0 015.5 3H20v15H5.5A1.5 1.5 0 014 16.5v-12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M4 16.5A1.5 1.5 0 015.5 18H20v3H6a2 2 0 01-2-2v-2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconPlus = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconUser = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M4 21a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconBack = (p: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconBookmark = (p: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M6 4h12v17l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export const IconBookmarkFill = (p: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...p}>
    <path d="M6 4h12v17l-6-4-6 4V4z" fill="currentColor"/>
  </svg>
);

export const IconSearch = (p: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const IconClock = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const IconFlame = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 3s5 4 5 9a5 5 0 11-10 0c0-2 1-3 2-3s1 1 1 2c1-3 2-5 2-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export const IconUsers = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3 20a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M16 6a3.5 3.5 0 010 7M21 20a5 5 0 00-3-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconSignal = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M4 19v-3M10 19v-7M16 19v-11M22 19v-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconCamera = (p: P) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

export const IconCheck = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconChevron = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconShare = (p: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconBell = (p: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M6 9a6 6 0 0112 0v4l1.5 3h-15L6 13V9zM10 19a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export const IconGear = (p: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M19.4 13.5a1 1 0 00.2-1.1l-1-1.7a1 1 0 00-1-.5l-1.5.2a6.4 6.4 0 00-1.3-.8l-.5-1.4a1 1 0 00-1-.7h-2a1 1 0 00-1 .7l-.5 1.4c-.5.2-.9.4-1.3.8l-1.5-.2a1 1 0 00-1 .5l-1 1.7a1 1 0 00.2 1.1l1 1c0 .5 0 1 0 1.4l-1 1a1 1 0 00-.2 1.1l1 1.7a1 1 0 001 .5l1.5-.2c.4.3.8.6 1.3.8l.5 1.4a1 1 0 001 .7h2a1 1 0 001-.7l.5-1.4c.5-.2.9-.4 1.3-.8l1.5.2a1 1 0 001-.5l1-1.7a1 1 0 00-.2-1.1l-1-1c0-.5 0-1 0-1.4l1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export const IconHeart = (p: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...p}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" fill="currentColor"/>
  </svg>
);

export const IconPencil = (p: P) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M14 4l6 6L9 21H3v-6L14 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
