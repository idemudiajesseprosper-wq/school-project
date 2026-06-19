"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CodesPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    const res = await fetch("/api/get-codes");
    const data = await res.json();

    // add temp fields safely
    const enriched = (data.codes || []).map((c) => ({
      ...c,
      email: "",
      parentName: "",
    }));

    setCodes(enriched);
  };

  const generateCode = async () => {
    setLoading(true);

    const res = await fetch("/api/generate-code", {
      method: "POST",
    });

    const data = await res.json();

    if (data.code) {
      toast.success("Code generated");
      fetchCodes();
    } else {
      toast.error("Failed to generate code");
    }

    setLoading(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied");
  };

  const updateField = (index, field, value) => {
    const updated = [...codes];
    updated[index][field] = value;
    setCodes(updated);
  };

  const sendCode = async (item) => {
    if (!item.email) {
      toast.error("Enter parent email");
      return;
    }

    const res = await fetch("/api/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: item.code,
        email: item.email,
        parentName: item.parentName,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Code sent successfully");
    } else {
      toast.error(data.message || "Failed to send");
    }
  };

  const copyWhatsApp = (item) => {
    const message = `Hello ${item.parentName || ""},

Your admission access code is: ${item.code}

Apply here:
https://yourwebsite.com/apply

Winners Foundation School`;

    navigator.clipboard.writeText(message);
    toast.success("WhatsApp message copied");
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Access Codes</h1>

        <button
          onClick={generateCode}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Generating..." : "Generate Code"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Send</th>
              </tr>
            </thead>

            <tbody>
              {codes.map((item, index) => (
                <tr key={item._id} className="border-t align-top">
                  {/* CODE */}
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-2">
                      {item.code}

                      <button
                        onClick={() => copyCode(item.code)}
                        className="text-blue-600 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    {item.used ? (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
                        Used
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                        Available
                      </span>
                    )}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTION */}
                  <td className="p-4 space-y-2 min-w-[220px]">
                    <input
                      placeholder="Parent email"
                      value={item.email}
                      onChange={(e) =>
                        updateField(index, "email", e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded-md text-sm"
                    />

                    <input
                      placeholder="Parent name"
                      value={item.parentName}
                      onChange={(e) =>
                        updateField(index, "parentName", e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded-md text-sm"
                    />

                    <button
                      onClick={() => sendCode(item)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm"
                    >
                      Send Email
                    </button>

                    <button
                      onClick={() => copyWhatsApp(item)}
                      className="w-full text-green-700 text-xs"
                    >
                      Copy WhatsApp Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {codes.length === 0 && (
          <p className="p-6 text-center text-gray-500">No codes yet</p>
        )}
      </div>
    </div>
  );
}
