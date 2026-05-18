export interface ChatConversation {
  triggers: string[];
  userMessage: string;
  aiResponse: string;
}

export const chatConversations: ChatConversation[] = [
  {
    triggers: ['hrv', 'niedrig', 'herzratenvariabilität'],
    userMessage: 'Warum ist mein HRV gerade so niedrig?',
    aiResponse: 'Dein HRV heute liegt bei 38ms – das sind 15% unter deinem 30-Tage-Schnitt von 45ms. Das ist typisch für Tag 14 deiner Lutealphase: Progesteron erhöht deinen Ruhepuls und senkt die Herzratenvariabilität. Hinzu kommen deine zwei Nächte mit unter 6h Schlaf. Mein Tipp: heute lieber leichter Spaziergang statt intensivem Sport.',
  },
  {
    triggers: ['fruchtbar', 'ovulation', 'schwanger', 'eisprung'],
    userMessage: 'Bin ich heute fruchtbar?',
    aiResponse: 'Ja – heute ist Tag 14 deines Zyklus, mitten in deinem fruchtbaren Fenster (Tage 12–16). Deine Basaltemperatur heute Morgen war 36.42°C – noch unterhalb der Sensiplan-Decklinie, was auf eine bevorstehende Ovulation hinweist. Dein Zervixschleim-Eintrag von gestern (fadenziehend, eiweißartig) bestätigt das. Die höchste Fruchtbarkeit liegt wahrscheinlich heute oder morgen.',
  },
  {
    triggers: ['muster', 'monate', 'analyse', 'erkannt', 'verlauf'],
    userMessage: 'Zeig mir meine Muster der letzten 3 Monate',
    aiResponse: 'In deinen letzten 3 Zyklen habe ich folgende Muster erkannt:\n\n① Deine Lutealphase ist konstant 14 Tage lang – sehr regelmäßig.\n② Dein HRV sinkt in den 3 Tagen vor der Periode durchschnittlich um 22% – ein zuverlässiger Frühindikator.\n③ Dein Schlaf ist in der Follikelphase am besten (Ø 7.4h), in der Lutealphase am schlechtesten (Ø 6.6h).\n④ Deine Stimmungswerte korrelieren stark mit deinem HRV (r=0.78).',
  },
  {
    triggers: ['periode', 'wann', 'nächste', 'kommt', 'prognose'],
    userMessage: 'Wann kommt meine nächste Periode?',
    aiResponse: 'Basierend auf deinen letzten 6 Zyklen (Ø 29 Tage, σ 1.2 Tage) erwarte ich deine nächste Periode mit 80% Wahrscheinlichkeit zwischen dem 30. Mai und dem 3. Juni – am wahrscheinlichsten am 1. Juni. Du bist aktuell an Tag 14, hast also noch etwa 15 Tage.',
  },
  {
    triggers: ['krämpfe', 'schmerzen', 'stark', 'bauch'],
    userMessage: 'Ich hatte gestern sehr starke Krämpfe',
    aiResponse: 'Das tut mir leid, danke dass du das mit mir teilst. Ich habe deine Krämpfe für gestern als stark gespeichert. Im Vergleich zu deinen letzten 3 Zyklen ist das intensiver als dein Durchschnitt. Falls starke Krämpfe regelmäßig auftreten, könnte ein Gespräch mit deiner Gynäkologin sinnvoll sein. Soll ich das in deinen nächsten Arzt-Export aufnehmen?',
  },
  {
    triggers: ['temperatur', 'basaltemperatur', 'bedeutet', 'gemessen'],
    userMessage: 'Was bedeutet meine Basaltemperatur heute?',
    aiResponse: 'Deine Temperatur heute Morgen war 36.42°C – das liegt unterhalb der Sensiplan-Decklinie von 36.6°C. Das bedeutet: Du bist wahrscheinlich noch nicht in der Lutealphase. Kombiniert mit deinem HRV-Muster und den Zervixschleimeinträgen deutet alles auf eine Ovulation in den nächsten 1–2 Tagen hin. Wichtig: Temperatur immer direkt nach dem Aufwachen messen, bevor du aufstehst.',
  },
];

export const fallbackResponse = 'Das ist eine gute Frage! Basierend auf deinen aktuellen Daten (Tag 14, Ovulationsphase, HRV 38ms) analysiere ich gerade deine Muster. Für eine präzise Antwort empfehle ich, die entsprechende Sektion im Dashboard zu öffnen – dort findest du alle Details visualisiert.';

export const quickReplies = [
  'Warum ist mein HRV niedrig?',
  'Bin ich heute fruchtbar?',
  'Muster der letzten 3 Monate',
  'Wann kommt meine Periode?',
];
