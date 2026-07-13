type RsvpSummaryCardsProps = {
  summary: {
    total: number;
    attending: number;
    notAttending: number;
    pending: number;
  };
};

export function RsvpSummaryCards({ summary }: RsvpSummaryCardsProps) {
  const cards = [
    { label: "Total invited", value: summary.total },
    { label: "Attending", value: summary.attending },
    { label: "Not attending", value: summary.notAttending },
    { label: "Pending", value: summary.pending },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-rose-700">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
