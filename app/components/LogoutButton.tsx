"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "../lib/auth";

type Props = {
  redirectTo: string;
  variant?: "header" | "button";
  label?: string;
};

export function LogoutButton({
  redirectTo,
  variant = "header",
  label = "Cerrar sesión",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (loading) return;
    setLoading(true);
    try {
      await signOut();
    } finally {
      router.push(redirectTo);
      router.refresh();
    }
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => void onClick()}
        disabled={loading}
      >
        {loading ? "Cerrando…" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="header-back header-back--btn"
      onClick={() => void onClick()}
      disabled={loading}
    >
      {loading ? "Cerrando…" : `← ${label}`}
    </button>
  );
}
