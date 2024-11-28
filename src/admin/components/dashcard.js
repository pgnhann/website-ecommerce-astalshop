import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export function DashboardCards() {
  const cards = [
    { title: 'Total Revenue', value: '$180.05', description: '+8.1% from last month' },
    { title: 'Total Orders', value: '102', description: '+4.5% from last month' },
    { title: 'Active Users', value: '+38', description: '+52 since last hour' },
    { title: 'Pending Orders', value: '8', description: '+16 since last hour' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
