"use client";

import { Save, Loader2 } from "lucide-react";

type Props = {
  onSave: () => Promise<void> | void;
  loading?: boolean;
};

export default function SaveButton({ onSave, loading = false }: Props) {
  return (
    <button
      onClick={onSave}
      disabled={loading}
      className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2
        hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: "var(--primary)" }}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save size={20} />
          Save Changes
        </>
      )}
    </button>
  );
}
