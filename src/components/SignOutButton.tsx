"use client";

export default function SignOutButton() {
  return (
    <button
      onClick={() => {
        window.location.href = '/api/auth/logout';
      }}
      className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
    >
      Sign out
    </button>
  );
}
