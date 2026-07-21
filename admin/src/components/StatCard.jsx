export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand">
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
