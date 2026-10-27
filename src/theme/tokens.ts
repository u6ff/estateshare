// Lab 03: design tokens. One place for colours, spacing, radius and type,
// so every screen in the app looks like part of the same system.

export const colors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  primary: '#1E4FD8',
  primaryDark: '#163CA6',
  primarySoft: '#E7EEFE',
  text: '#0F172A',
  textSoft: '#334155',
  muted: '#64748B',
  border: '#E2E8F0',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  success: '#15803D',
  successSoft: '#DCFCE7',
  warning: '#B45309',
  warningSoft: '#FEF3C7',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

export const type = {
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.textSoft },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.muted },
};

// Soft shadow used by cards (iOS shadow* + Android elevation).
export const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};
