import type { InvitableUserRole } from "@/lib/types/user-invitations";

const ROLE_LABELS: Record<InvitableUserRole, string> = {
  hacker: "Hacker",
  organizer: "Organizer",
  volunteer: "Volunteer",
  judge: "Judge",
};

export function userRoleLabel(role: InvitableUserRole) {
  return ROLE_LABELS[role];
}
