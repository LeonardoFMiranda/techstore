import { db } from "@/lib/db";
import { UserRoleEnum } from "@prisma/client";

/**
 * Gets the role of a user by their Clerk userId.
 * Returns CUSTOMER if no role is found.
 */
export async function getUserRole(userId: string): Promise<UserRoleEnum> {
  const userRole = await db.userRole.findUnique({
    where: { userId },
  });
  return userRole?.role ?? UserRoleEnum.CUSTOMER;
}

/**
 * Checks if a user is an admin.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === UserRoleEnum.ADMIN;
}
