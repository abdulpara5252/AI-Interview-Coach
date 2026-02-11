import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  { name: "Free", price: "$0", features: ["3 sessions/week", "Basic feedback", "Single role"] },
  { name: "Pro", price: "$19/mo", features: ["Unlimited sessions", "Full AI report", "Voice replay", "Shareable reports"] },
  { name: "Team", price: "$79/mo", features: ["Org dashboard", "Coach notes", "Priority support"] }
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="mt-2 text-muted-foreground">Pick the plan that matches your interview prep pace.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-2xl font-bold">{tier.price}</p>
              <ul className="list-disc pl-5 text-sm">
                {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
