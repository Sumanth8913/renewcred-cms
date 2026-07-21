'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa6';
import { LuLock } from 'react-icons/lu';
import { submitForm } from '../lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await submitForm('newsletter', { email });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <footer className="mt-20 rounded-t-[2.5rem] bg-footer px-6 pb-8 pt-12 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">
            Renew<span className="text-brand">Cred</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>📍 Indiranagar, Bengaluru, Karnataka, INDIA</li>
            <li>✉️ yp@renewcred.com</li>
            <li>🕒 There is no time to save the planet</li>
            <li>CIN No.: XXXXXXXXX</li>
          </ul>
          <div className="mt-4 flex gap-3">
            {[FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
              <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-600">
                <Icon size={14} />
              </span>
            ))}
          </div>
        </div>

        <nav className="space-y-2 text-sm">
          {[
            ['Buyer', '/buyer'],
            ['Supplier', '/supplier'],
            ['Climate & Us', '/'],
            ['Science', '/'],
            ['Standards', '/standards'],
            ['Contact Us', '/contact'],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="block hover:text-white">
              {label}
            </Link>
          ))}
        </nav>

        <div>
          <p className="flex items-center gap-1 italic text-white">
            <LuLock size={14} /> No spam. Just pure climate intelligence.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Your Email Address Please!"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full border-none px-4 py-2 text-sm text-ink focus:outline-none"
            />
            <button type="submit" className="w-fit rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              {status === 'loading' ? 'Subscribing...' : status === 'done' ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-gray-700 pt-6 text-xs text-gray-500 md:flex-row">
        <p>Copyright © {new Date().getFullYear()} Renewred. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms &amp; Conditions</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}
