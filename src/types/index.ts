export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
export type InsightType = 'anomaly' | 'pattern' | 'recommendation' | 'warning';
export type Severity = 'info' | 'warning' | 'alert' | 'positive';

export interface CycleDay {
  date: string; // ISO date string
  dayOfCycle: number;
  phase: CyclePhase;
  temperature?: number; // Basaltemperatur in °C
  symptoms: string[];
  cervicalMucus?: 'dry' | 'moist' | 'creamy' | 'egg-white';
  notes?: string;
  mood?: number; // 1-5
  energy?: number; // 1-5
}

export interface WearableDay {
  date: string;
  hrv: number; // ms
  restingHR: number; // bpm
  sleepScore: number; // 0-100
  deepSleep: number; // hours
  remSleep: number; // hours
  lightSleep: number; // hours
  steps: number;
  activeCalories: number;
}

export interface KIInsight {
  id: string;
  type: InsightType;
  severity: Severity;
  title: string;
  description: string;
  date: string;
  actionableHint?: string;
  pinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cycleLength: number;
  periodLength: number;
  partnerConnected: boolean;
  isPartner?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'as-needed';
  time?: string; // e.g. "08:00"
  active: boolean;
}
