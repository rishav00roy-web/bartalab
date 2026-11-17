"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="error-page">
      <div className="card empty">
        <h2>Something went wrong</h2>
        <p>The page couldn&apos;t load. Check your connection and try again.</p>
        <button type="button" className="btn btn-primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
