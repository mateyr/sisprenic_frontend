import {
  IconLayoutDashboard,
  IconUsersGroup,
  IconBuildingBank,
  IconCreditCardPay,
  IconReportAnalytics,
  IconUser,
  IconShield,
  type Icon,
} from "@tabler/icons-react";

const iconMap: Record<string, Icon> = {
  IconLayoutDashboard,
  IconUsersGroup,
  IconBuildingBank,
  IconCreditCardPay,
  IconReportAnalytics,
  IconUser,
  IconShield
};

export function getIcon(name: string): Icon | undefined {
  return iconMap[name];
}
