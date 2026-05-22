import Link from "next/link";
import { loginAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <span className="star">&#10022;</span> Sanchit
          <span className="tag">Admin</span>
        </div>

        <h1 className="adm-login-title">Welcome back.</h1>
        <p className="adm-login-sub">
          Sign in to manage the content on your portfolio.
        </p>

        <form action={loginAction} className="adm-login-form">
          <label className="adm-field">
            <span className="adm-label">Password</span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              placeholder="Enter admin password"
              className="adm-input"
            />
          </label>
          {error && (
            <p className="adm-error">Incorrect password. Please try again.</p>
          )}
          <button className="adm-login-submit">
            Sign in <span aria-hidden="true">&rarr;</span>
          </button>
        </form>

        <Link href="/" className="adm-login-back">
          &larr; Back to site
        </Link>
      </div>
    </div>
  );
}
