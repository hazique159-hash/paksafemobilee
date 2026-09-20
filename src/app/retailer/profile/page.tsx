"use client";

import { useEffect, useState } from "react";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", 
  "Multan", "Peshawar", "Quetta", "Gujranwala", "Sialkot", "Other"
];

export default function ShopProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    city: "Karachi",
  });
  const [shopImage, setShopImage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/retailer/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            shopName: data.shopName || "",
            shopAddress: data.shopAddress || "",
            city: data.city || "Karachi",
          });
          if (data.shopImage) setShopImage(data.shopImage);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image must be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImage(reader.result as string);
        setMessage({ type: "", text: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/retailer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          shopImage,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Shop Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {message.text && (
          <div className={`p-3 rounded-xl mb-6 text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder="Your shop's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
              value={formData.shopAddress}
              onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
              placeholder="Full address of your shop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Logo / Image (Max 2MB)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer"
            />
            {shopImage && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Current Image Preview:</p>
                <img src={shopImage} alt="Shop" className="h-20 object-contain rounded-lg border border-gray-100" />
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
