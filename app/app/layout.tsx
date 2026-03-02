import { AppShell } from "@/components/app-shell";
import { ProgressProvider } from "@/components/progress-provider";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <AppShell>{children}</AppShell>
    </ProgressProvider>
  );
}
