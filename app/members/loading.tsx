export default function Loading() {
  return (
    <main className="feed" aria-busy="true" aria-label="Loading members">
      {[0, 1].map((i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton skeleton-line w-name" />
          {[0, 1, 2].map((j) => (
            <div key={j} className="skeleton-row">
              <div className="skeleton skeleton-avatar" />
              <div className="skeleton skeleton-line w-70" />
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
