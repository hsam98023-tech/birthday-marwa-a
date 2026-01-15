export enum AppStage {
  LOGIN = 'LOGIN',
  COUNTDOWN = 'COUNTDOWN',
  CELEBRATION = 'CELEBRATION',
  ADMIN = 'ADMIN'
}

export interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  dateStr: string;
}