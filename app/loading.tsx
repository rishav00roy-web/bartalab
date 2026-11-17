export default function Loading() {
  return (
    <main className="feed" aria-busy="true" aria-label="Loading posts">
      {[0, 1].map((i) => (
        <div key={i} className="card" style={{ padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            <div className="skeleton" style={{ width: 140, height: 14 }} />
          </div>
          <div className="skeleton" style={{ height: 14 }} />
          <div className="skeleton" style={{ height: 14, width: "70%" }} />
          <div className="skeleton" style={{ height: 220 }} />
        </div>
      ))}
    </main>
  );
}
