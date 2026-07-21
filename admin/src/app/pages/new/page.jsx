'use client';

import ProtectedLayout from '../../../components/ProtectedLayout';
import PageForm from '../../../components/PageForm';

export default function NewPagePage() {
  return (
    <ProtectedLayout title="Create Page">
      <PageForm />
    </ProtectedLayout>
  );
}
