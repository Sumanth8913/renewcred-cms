'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedLayout from '../../../components/ProtectedLayout';
import PageForm from '../../../components/PageForm';
import api from '../../../lib/api';

export default function EditPagePage() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/pages/${id}`)
      .then((res) => setPage(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ProtectedLayout title="Edit Page">
      {loading && <p className="text-gray-400">Loading...</p>}
      {!loading && page && <PageForm initialPage={page} />}
      {!loading && !page && <p className="text-gray-400">Page not found.</p>}
    </ProtectedLayout>
  );
}
