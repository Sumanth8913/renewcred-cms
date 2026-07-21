import OnboardingForm from '../../components/OnboardingForm';

export const metadata = { title: 'Get Started as a Buyer — RenewCred' };

export default function BuyerPage() {
  return (
    <div className="container-px grid gap-10 py-16 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-4xl italic text-ink">Get Started as a Buyer</h1>
        <p className="mt-4 max-w-md text-ink-soft">
          Whether you are offsetting residual emissions, building a long-term net-zero roadmap, or integrating carbon
          credits into financial products, RenewCred helps you move forward with clarity and confidence.
        </p>
        <p className="mt-4 max-w-md text-ink-soft">
          Complete the buyer onboarding form to explore available credits, understand quality metrics, and begin your
          journey with RenewCred.
        </p>
      </div>
      <OnboardingForm formType="buyer" />
    </div>
  );
}
