export interface AppNotification {
  id: string;
  type: 'reminder' | 'insight' | 'alert' | 'social' | 'report';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  lucideIcon: string;
  iconBg: string;
  action?: { label: string; route: string };
}

export const initialNotifications: AppNotification[] = [
  { id: '0', type: 'reminder', title: 'Pille noch nicht eingenommen', body: 'Du hast deine Mikropille heute noch nicht als eingenommen markiert. Denk daran, sie möglichst zur gleichen Zeit zu nehmen.', timestamp: 'vor 5 Min.', read: false, lucideIcon: 'Pill', iconBg: 'bg-purple-100 text-purple-600', action: { label: 'Tageseintrag öffnen', route: '/' } },
  { id: '1', type: 'reminder', title: 'Temperatur messen', body: 'Guten Morgen! Heute ist ein wichtiger Messtag – miss deine Temperatur bevor du aufstehst.', timestamp: 'vor 20 Min.', read: false, lucideIcon: 'Thermometer', iconBg: 'bg-[#EEF0FF] text-[#6F7CFF]' },
  { id: '2', type: 'insight', title: 'Fruchtbares Fenster beginnt morgen', body: 'Die nächsten 5 Tage haben erhöhte Fruchtbarkeit. Deine Ovulation wird für übermorgen erwartet.', timestamp: 'heute, 07:00', read: false, lucideIcon: 'Flower2', iconBg: 'bg-amber-100 text-amber-600', action: { label: 'Dashboard öffnen', route: '/' } },
  { id: '3', type: 'alert', title: 'HRV unter Baseline', body: 'Dein HRV war heute 38ms – 15% unter deinem Schnitt. Gönn dir heute Erholung statt intensivem Sport.', timestamp: 'heute, 08:30', read: false, lucideIcon: 'Activity', iconBg: 'bg-orange-100 text-orange-600', action: { label: 'Wearables ansehen', route: '/wearables' } },
  { id: '4', type: 'report', title: 'Wochenbericht bereit', body: 'Dein HRV-Wochenbericht ist verfügbar. Ø HRV: 43ms (+2ms vs. Vorwoche). Schlaf: 7.1h.', timestamp: 'gestern, 18:00', read: true, lucideIcon: 'BarChart2', iconBg: 'bg-teal-100 text-teal-600', action: { label: 'Insights ansehen', route: '/insights' } },
  { id: '5', type: 'social', title: 'Tom ist jetzt verbunden', body: 'Tom hat deine Einladung angenommen und ist jetzt mit deinem Konto als Partner verbunden.', timestamp: 'vor 3 Tagen', read: true, lucideIcon: 'Users', iconBg: 'bg-purple-100 text-purple-600' },
  { id: '6', type: 'alert', title: 'Schlafmangel erkannt', body: '3 Nächte unter 6h Schlaf in Folge. Das kann deine HRV und Zyklusregularität negativ beeinflussen.', timestamp: 'vor 2 Tagen', read: true, lucideIcon: 'Moon', iconBg: 'bg-blue-100 text-blue-600' },
  { id: '7', type: 'insight', title: 'Neue Periodenprognose', body: 'Deine nächste Periode wird voraussichtlich am 1. Juni erwartet (80% Konfidenz).', timestamp: 'vor 4 Tagen', read: true, lucideIcon: 'Calendar', iconBg: 'bg-[#EEF0FF] text-[#6F7CFF]' },
  { id: '8', type: 'report', title: 'Arzt-Bericht erstellt', body: 'Dein Gesundheitsbericht für März wurde erstellt und ist als PDF bereit.', timestamp: 'vor 1 Woche', read: true, lucideIcon: 'FileText', iconBg: 'bg-gray-100 text-gray-600' },
  { id: '9', type: 'reminder', title: 'Eisenpräparat vergessen (gestern)', body: 'Du hast gestern dein Eisenpräparat nicht eingenommen. In der Menstruationsphase ist regelmäßige Eiseneinnahme besonders wichtig.', timestamp: 'gestern, 21:00', read: true, lucideIcon: 'Pill', iconBg: 'bg-purple-100 text-purple-600' },
];
