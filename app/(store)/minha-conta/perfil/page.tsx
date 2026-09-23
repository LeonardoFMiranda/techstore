import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Dados",
};

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Meus Dados</h1>
      <div className="w-full overflow-hidden">
        <UserProfile 
          routing="hash"
          appearance={{
            // @ts-ignore
            baseTheme: dark,
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none border border-[var(--border)]",
              card: "w-full rounded-2xl shadow-none bg-[var(--bg-card)]",
              scrollBox: "rounded-2xl",
              navbar: "border-r border-[var(--border)] bg-[var(--bg-elevated)]",
            },
            variables: {
              colorPrimary: "#00e69e",
            }
          }}
        />
      </div>
    </div>
  );
}
