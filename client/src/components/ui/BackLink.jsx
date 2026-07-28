import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackLink({
  to = "/events",
  children = "Back to events",
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
    >
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}
