"use client";

import {
  Bell,
  Bot,
  CalendarDays,
  CalendarOff,
  CheckCheck,
  CircleHelp,
  FileCheck,
  FileText,
  LogOut,
  Mail,
  Map,
  MapPin,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SquarePen,
  Timer,
  User,
  UserCheck,
  UserRoundSearch,
  Users,
  Volume2,
  VolumeX,
  Vote,
  WalletCards,
  X,
} from "lucide-react";
import type { ComponentType } from "react";

export type AppIconName =
  | "account_balance"
  | "assignment_ind"
  | "assignment_turned_in"
  | "ballot"
  | "calendar_month"
  | "chat"
  | "check_circle"
  | "close"
  | "dashboard"
  | "description"
  | "elderly"
  | "event"
  | "event_busy"
  | "help"
  | "how_to_reg"
  | "how_to_vote"
  | "location_on"
  | "logout"
  | "mail"
  | "map"
  | "model_training"
  | "notifications"
  | "person"
  | "person_search"
  | "quiz"
  | "refresh"
  | "search"
  | "settings"
  | "timer"
  | "verified"
  | "volume_off"
  | "volume_up";

const iconMap = {
  account_balance: ShieldCheck,
  assignment_ind: UserCheck,
  assignment_turned_in: FileCheck,
  ballot: SquarePen,
  calendar_month: CalendarDays,
  chat: Bot,
  check_circle: CheckCheck,
  close: X,
  dashboard: WalletCards,
  description: FileText,
  elderly: Users,
  event: CalendarDays,
  event_busy: CalendarOff,
  help: CircleHelp,
  how_to_reg: Vote,
  how_to_vote: Vote,
  location_on: MapPin,
  logout: LogOut,
  mail: Mail,
  map: Map,
  model_training: Bot,
  notifications: Bell,
  person: User,
  person_search: UserRoundSearch,
  quiz: CircleHelp,
  refresh: RefreshCw,
  search: Search,
  settings: Settings,
  timer: Timer,
  verified: ShieldCheck,
  volume_off: VolumeX,
  volume_up: Volume2,
} satisfies Record<AppIconName, ComponentType<{ className?: string }>>;

interface AppIconProps {
  name: AppIconName;
  className?: string;
  style?: React.CSSProperties;
}

export function AppIcon({ name, className, style }: AppIconProps) {
  const Icon = iconMap[name];
  return <Icon aria-hidden="true" className={className} style={style} strokeWidth={2} />;
}
