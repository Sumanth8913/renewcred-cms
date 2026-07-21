import OnboardingForm from '../../components/OnboardingForm';

export const metadata = { title: 'Get Started as a Supplier — RenewCred' };

export default function SupplierPage() {
  return (
    <div className="container-px grid gap-10 py-16 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-4xl italic text-ink">Get Started as a Supplier</h1>
        <p className="mt-4 max-w-md text-ink-soft">
          List and certify your carbon reduction or removal projects with RenewCred's rigorous, transparent
          standards — built for EV, Biochar, Methane, and Renewable Energy project types.
        </p>
        <p className="mt-4 max-w-md text-ink-soft">
          Complete the supplier onboarding form and our standards team will reach out with next steps for
          certification.
        </p>
      </div>
      <OnboardingForm formType="supplier" />
    </div>
  );
}
