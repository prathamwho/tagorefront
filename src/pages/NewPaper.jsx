import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const NewPaper = () => {
  const { authUser } = useAuthStore();
  const userid = authUser._id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user: userid,
    title: "",
    researcher: "",
    institution: "",
    abstract: "",
    keywords: "",
    documentUrl: "",     // stores the Cloudinary URL after upload
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Uploads PDF to Cloudinary on file select, saves URL into form state
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading paper...");
    setUploading(true);

    try {
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("upload_preset", "tagore_pdf");
      fileData.append("folder", "Tagore_Cloud");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvbbmbius/raw/upload",
        { method: "POST", body: fileData }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error(data?.error?.message || "Upload failed");
        return;
      }

      const url = data.secure_url + "?response-content-disposition=inline";

      setForm((prev) => ({ ...prev, documentUrl: url }));
      toast.dismiss(toastId);
      toast.success("Paper uploaded successfully!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong during upload.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // You write the backend call here
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.documentUrl) {
      toast.error("Please upload a document first.");
      return;
    }

    console.log("Submitting form:", form);
    const toastId = toast.loading("Submitting paper...");
    
    try {
        
        const res = await axiosInstance.post('/paper/newpaper', form);

      toast.dismiss(toastId);
      toast.success(res.data.message || "Paper submitted!");
      setTimeout(()=>{
        navigate('/profile')
      },2000);

      console.log(res.data);

    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Submission failed.");
      console.error(err);
    }

  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] px-6 py-10">

      <h1 className="text-[22px] font-bold">Submit Paper</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1f6feb]"
          />
        </div>

        {/* Researcher */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Researcher</label>
          <input
            name="researcher"
            value={form.researcher}
            onChange={handleChange}
            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1f6feb]"
          />
        </div>

        {/* Institution */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Institution</label>
          <input
            name="institution"
            value={form.institution}
            onChange={handleChange}
            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1f6feb]"
          />
        </div>

        {/* Abstract */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Abstract</label>
          <textarea
            name="abstract"
            value={form.abstract}
            onChange={handleChange}
            rows={4}
            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1f6feb]"
          />
        </div>

        {/* Keywords */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Keywords</label>
          <input
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            placeholder="e.g. Healthcare, Blockchain, AI; (separated by commas)"
            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1f6feb]"
          />
        </div>

        {/* Document Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Document</label>
          <input
            type="file"
            name="document"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}          // ← triggers Cloudinary upload
            disabled={uploading}
            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#c9d1d9] file:mr-3 file:px-3 file:py-1 file:border-0 file:rounded-md file:bg-[#1f6feb] file:text-white file:text-sm file:font-bold hover:file:bg-[#1a5fd1] cursor-pointer"
          />
          {/* Shows URL confirmation once uploaded */}
          {form.documentUrl && (
            <p className="text-xs text-green-400 mt-1">✓ Document ready</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-[#1f6feb] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#1a5fd1] transition whitespace-nowrap disabled:opacity-50"
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default NewPaper;