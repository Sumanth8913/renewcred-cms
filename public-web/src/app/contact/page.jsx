'use client';

import { useState } from 'react';
import { submitForm } from '../../lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitForm('contact', form);
      setStatus('done');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div className="container-px max-w-xl py-16">
      <h1 className="font-serif text-4xl italic text-ink">Contact Us</h1>
      <p className="mt-4 text-ink-soft">Questions about standards, certification, or partnerships — we'd love to hear from you.</p>

      {status === 'done' ? (
        <p className="mt-8 rounded-lg bg-green-50 p-4 text-sm text-green-700">Thanks for reaching out — we'll respond soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name*</label>
            <input required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.name} onChange={update('name')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email*</label>
            <input required type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.email} onChange={update('email')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message*</label>
            <textarea required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.message} onChange={update('message')} />
          </div>
          <button type="submit" disabled={status === 'loading'} className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
