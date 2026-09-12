export type HeaderPanel = 'mobile' | 'profile' | 'notification';

export interface HeaderMenuItem {
  menu: string;
  href: string;
  activePrefix?: string;
}

export const HEADER_PANEL_IDS = {
  mobile: 'header-mobile-menu',
  profile: 'header-profile-menu',
  notification: 'header-notification-menu',
} as const;
