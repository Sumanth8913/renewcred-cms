'use client';

import { useState } from 'react';
import { submitForm } from '../lib/api';

export default function OnboardingForm({ formType }) {
  const [form, setForm] = useState({ fullName: '', organization: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitForm(formType, form);
      setStatus('done');
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">Thanks — our team will be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Full Name*</label>
        <input required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.fullName} onChange={update('fullName')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Organization</label>
        <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.organization} onChange={update('organization')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email-Id*</label>
        <input required type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.email} onChange={update('email')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Phone No.</label>
        <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.phone} onChange={update('phone')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Any message for us?</label>
        <textarea rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.message} onChange={update('message')} />
      </div>
      <button type="submit" disabled={status === 'loading'} className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        {status === 'loading' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
