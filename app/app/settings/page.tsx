"use client";

import { RotateCcw } from "lucide-react";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const { resetProgress } = useProgress();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage local progress for this demo account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={resetProgress} className="rounded-xl">
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
