"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateSession } from "@/hooks/use-create-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function NewInterviewPage() {
  const [role, setRole] = useState("Frontend Developer");
  const [interviewType, setInterviewType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState("1800");
  const router = useRouter();
  const mutation = useCreateSession();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader><CardTitle>Start a New Interview</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Target Role</Label><Select value={role} onChange={(e) => setRole(e.target.value)}><option>Frontend Developer</option><option>Backend Developer</option><option>Full Stack Developer</option><option>Product Manager</option><option>Data Scientist</option><option>UX/UI Designer</option><option>DevOps / Cloud Engineer</option></Select></div>
          <div><Label>Interview Type</Label><Select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}><option value="technical">technical</option><option value="behavioral">behavioral</option><option value="mixed">mixed</option></Select></div>
          <div><Label>Difficulty</Label><Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></Select></div>
          <div><Label>Duration</Label><Select value={duration} onChange={(e) => setDuration(e.target.value)}><option value="900">15 min</option><option value="1800">30 min</option><option value="2700">45 min</option><option value="3600">60 min</option></Select></div>
          <Button
            onClick={async () => {
              const session = await mutation.mutateAsync({ role, interviewType, difficulty, duration: Number(duration) });
              router.push(`/interview/${session.id}`);
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Launch Voice Interview"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
