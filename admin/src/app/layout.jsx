import './globals.css';
import AppProviders from '../store/Provider';

export const metadata = {
  title: 'RenewCred Admin CMS',
  description: 'Content management dashboard for the RenewCred website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
