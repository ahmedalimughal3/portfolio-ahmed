"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};
const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <Link className="admin-brand" href="/" aria-label="Back to portfolio">
          <span className="admin-brand-mark">A</span>
          <span>AHMED<span className="admin-brand-dot">.</span> / ADMIN</span>
        </Link>
        <span className="admin-eyebrow">PRIVATE WORKSPACE</span>
        <h1 id="admin-login-title">Welcome<br />back<span>.</span></h1>
        <p>Sign in with the admin account created for your Supabase project.</p>
        {!hasSupabaseConfig && (
          <p className="admin-setup-note" role="status">
            Supabase is not connected yet. Add the project URL and publishable key to <code>.env.local</code>, then restart the app.
          </p>
        )}
        <form action={formAction} className="admin-form">
          <label>
            Email address
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
          <button className="admin-primary-button" disabled={isPending} type="submit">
            {isPending ? "Signing in..." : "Sign in"}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <Link className="admin-back-link" href="/">← Back to portfolio</Link>
      </section>
      <div className="admin-login-aside" aria-hidden="true">
        <span>YOUR WORK,<br />YOUR WAY.</span>
        <i>✳</i>
        <small>CONTENT MANAGEMENT / 01</small>
      </div>
    </main>
  );
}
