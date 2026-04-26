import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Mail } from "lucide-react";
import defaultAvatar from "../../public/default-Photo.png";

const DashboardProfileSummary = ({ profile }) => {
  const navigate = useNavigate();
  const name = profile?.name || "Researcher";
  const role = profile?.role || "Researcher";
  const email = profile?.email || "No email connected";
  const quote =
    profile?.quote ||
    "Research is to see what everybody else has seen, and to think what nobody else has thought.";

  return (
    <section className="border-b border-(--border-subtle) pb-8">
      <div className="flex items-start justify-between gap-8">
        <div className="flex items-center gap-8">
          <img
            src={profile?.avatar || defaultAvatar}
            alt={name}
            className="h-24 w-24 rounded-full border border-amber-500/45 object-cover"
          />

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-(--text-primary)">{name}</h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.22em] text-amber-400">{role}</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-(--text-secondary)">
              <Mail size={16} className="text-(--text-muted)" />
              {email}
            </div>
            <blockquote className="mt-5 max-w-xl text-base italic leading-8 text-(--text-muted)">
              "{quote}"
            </blockquote>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/profile/edit")}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-500/50 px-4 py-2.5 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10"
        >
          <Edit3 size={15} />
          Edit Profile
        </button>
      </div>
    </section>
  );
};

export default DashboardProfileSummary;
