"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPhone() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    color: "",
    condition: "10/10",
    ramStorage: "",
    status: "AVAILABLE",
  });
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/retailer/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add phone");
      }

      router.push("/retailer/phones");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-[#1e1b4b] mb-6">Add New Phone</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Samsung"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Galaxy S23"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g. Phantom Black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RAM / Storage</label>
              <input
                type="text"
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all"
                value={formData.ramStorage}
                onChange={(e) => setFormData({ ...formData, ramStorage: e.target.value })}
                placeholder="e.g. 8gb / 256gb"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all bg-white"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}/10`}>
                    {i + 1}/10
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-4 py-3 md:py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (Max 2MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#0d9488] hover:file:bg-teal-100 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
             <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-6 py-3 md:py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 md:py-2 bg-[#1e1b4b] hover:bg-[#312e81] text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? "Saving..." : "Save Phone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
