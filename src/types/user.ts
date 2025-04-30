export enum UserType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  type: UserType;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  generationsUsed: number;
  maxGenerations: number;
}

export interface Meditation {
  id: string;
  userId: string;
  title: string;
  audioUrl: string;
  prompt: string;
  createdAt: Date;
}

export interface Library {
  userId: string;
  meditations: Meditation[];
} 