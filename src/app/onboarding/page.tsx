"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function OnboardingPage() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [experience, setExperience] = useState("mid");
  const [name, setName] = useState("");
  const [preferredInterview, setPreferredInterview] = useState("mixed");
  const [bio, setBio] = useState("");
  const [companies, setCompanies] = useState("");

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader><CardTitle>Complete Onboarding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Target Role</Label><Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} /></div>
          <div>
            <Label>Experience</Label>
            <Select value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="junior">junior</option>
              <option value="mid">mid</option>
              <option value="senior">senior</option>
            </Select>
          </div>
          <div>
            <Label>Interview Preference</Label>
            <Select value={preferredInterview} onChange={(e) => setPreferredInterview(e.target.value)}>
              <option value="technical">technical</option>
              <option value="behavioral">behavioral</option>
              <option value="mixed">mixed</option>
            </Select>
          </div>
          <div><Label>Bio</Label><Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short intro" /></div>
          <div><Label>Target Companies (comma separated)</Label><Input value={companies} onChange={(e) => setCompanies(e.target.value)} /></div>
          <Button
            onClick={async () => {
              await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  targetRole,
                  experience,
                  name,
                  preferredInterview,
                  bio,
                  companies: companies.split(",").map((v) => v.trim()).filter(Boolean)
                })
              });
              router.push("/dashboard");
            }}
          >
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
