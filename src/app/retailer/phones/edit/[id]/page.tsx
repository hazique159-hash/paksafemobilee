"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPhone() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await fetch(`/api/retailer/phones/${id}`);
        if (!res.ok) throw new Error("Failed to fetch phone");
        const data = await res.json();
        setFormData({
          brand: data.brand || "",
          model: data.model || "",
          price: data.price ? String(data.price) : "",
          color: data.color || "",
          condition: data.condition || "10/10",
          ramStorage: data.ramStorage || "",
          status: data.status || "AVAILABLE",
        });
        setImageBase64(data.image || "");
      } catch (err) {
        console.error(err);
        setError("Could not load phone data");
      } finally {
        setLoading(false);
      }
    };
    fetchPhone();
  }, [id]);

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
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/retailer/phones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update phone");
      }

      router.push("/retailer/phones");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading phone data...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Edit Phone</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
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
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RAM / Storage</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                value={formData.ramStorage}
                onChange={(e) => setFormData({ ...formData, ramStorage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer"
              />
              {imageBase64 && (
                <div className="mt-2 text-xs text-teal-600 font-medium">Image uploaded/saved</div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1e1b4b] hover:bg-[#312e81] text-white rounded-xl font-medium transition-colors disabled:opacity-70 min-h-[44px]"
            >
              {saving ? "Saving..." : "Update Phone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
