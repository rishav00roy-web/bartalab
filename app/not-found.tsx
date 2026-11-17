import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-page">
      <div className="card empty">
        <h2>Page not found</h2>
        <p>This page doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-primary">
          Back to the feed
        </Link>
      </div>
    </main>
  );
}
