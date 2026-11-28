export default function Loading() {
  return (
    <main className="feed" aria-busy="true" aria-label="Loading posts">
      {[0, 1].map((i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton-row">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton skeleton-line w-name" />
          </div>
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line w-70" />
          <div className="skeleton skeleton-media" />
        </div>
      ))}
    </main>
  );
}
