import { type Document } from 'mongoose';

export interface ITelegranUser {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface IUser extends Document {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  score: number;
  dailyScore: number;
  monthlyScore: number;
  lastUpdated: string;
  lastUpdatedMonthly: string;
  availableLines: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserInput {
  _id?: string;
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  score: number;
  dailyScore: number;
  monthlyScore: number;
  lastUpdated: string;
  lastUpdatedMonthly: string;
  availableLines: number;
}
