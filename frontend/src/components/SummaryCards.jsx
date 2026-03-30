export function SummaryCards({ summary }) {
  const cards = [
    { title: "Total Income", value: summary.total_income },
    { title: "Total Expenses", value: summary.total_expenses },
    { title: "Savings", value: summary.savings },
    { title: "Remaining Balance", value: summary.remaining_balance },
  ];

  return (
    <section className="cards-grid">
      {cards.map((card) => (
        <article key={card.title} className="card">
          <h3>{card.title}</h3>
          <p>${Number(card.value || 0).toFixed(2)}</p>
        </article>
      ))}
    </section>
  );
}
