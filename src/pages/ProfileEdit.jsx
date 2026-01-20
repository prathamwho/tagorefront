import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function ProfileEdit() {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthStore();

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    institution: "",
    location: "",
    website: "",
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authUser) return;

    setForm({
      headline: authUser?.headline || "",
      bio: authUser?.bio || "",
      institution: authUser?.institution || "",
      location: authUser?.location || "",
      website: authUser?.website || "",
      socials: authUser?.socials || {
        github: "",
        linkedin: "",
        twitter: "",
      },
    });
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch("http://localhost:1601/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ cookie auth
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to update profile");
        return;
      }

      toast.success(data?.message || "Changes saved!");

      if (data?.updatedUser) setAuthUser(data.updatedUser);

      navigate(`/profile`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-semibold">Edit Profile</h1>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#58a6ff] hover:underline"
          >
            Cancel
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#21262d] bg-[#0d1117] shadow-lg overflow-hidden">
          <div className="p-6 space-y-6">
            {/* User Name */}
            <div>
              <p className="text-lg font-semibold">
                {authUser?.firstName} {authUser?.lastName}
              </p>
              <p className="text-sm text-[#8b949e]">{authUser?.email}</p>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Headline"
                name="headline"
                value={form.headline}
                onChange={handleChange}
                placeholder="Enter headline"
              />
              <Input
                label="Institution"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Enter institution"
              />
              <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
              <Input
                label="Website"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-[#8b949e]">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-lg border border-[#21262d] bg-[#161b22] px-3 py-2 text-sm text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                placeholder="Write something about yourself..."
              />
            </div>

            {/* Socials */}
            <div>
              <p className="text-xs uppercase tracking-wide text-[#8b949e] mb-2">
                Social Links
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="GitHub"
                  name="github"
                  value={form.socials.github || ""}
                  onChange={handleSocialChange}
                  placeholder="github.com/username"
                />
                <Input
                  label="LinkedIn"
                  name="linkedin"
                  value={form.socials.linkedin || ""}
                  onChange={handleSocialChange}
                  placeholder="linkedin.com/in/username"
                />
                <Input
                  label="Twitter"
                  name="twitter"
                  value={form.socials.twitter || ""}
                  onChange={handleSocialChange}
                  placeholder="twitter.com/username"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg border border-[#21262d] bg-[#161b22] px-4 py-2 text-sm hover:bg-[#1c2128] transition"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleSave}
                className="rounded-lg bg-[#1f6feb] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2a7fff] disabled:opacity-60 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-[#8b949e]">{label}</label>
    <input
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full rounded-lg border border-[#21262d] bg-[#161b22] px-3 py-2 text-sm text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
    />
  </div>
);

export default ProfileEdit;
