const sample = [
  { id: 1, title: 'Fresh apples', qty: '10kg', note: 'Picked today' },
  { id: 2, title: 'Bread loaves', qty: '6', note: 'Assorted' },
  { id: 3, title: 'Salads', qty: '4 boxes', note: 'Ready to serve' },
];

export default function Listings() {
  return (
    <section>
      <h2>Available listings</h2>
      <div className="grid listings-grid">
        {sample.map((item) => (
          <article key={item.id} className="card listing-card">
            <h3>{item.title}</h3>
            <p className="muted">{item.qty}</p>
            <p>{item.note}</p>
            <div className="card-actions">
              <button>Claim</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
