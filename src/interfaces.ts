export interface ITelegranUser {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface IUser {
  id?: string;
  external_id_telegram: string;
  username: string;
  first_name: string;
  last_name: string;
  score: number;
  dailyScore: number;
  monthlyScore: number;
  lastUpdated: string;
  lastUpdatedMonthly: string;
  availableLines: number;
  previousRank: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserInput {
  id?: string;
  external_id_telegram: string;
  username: string;
  first_name: string;
  last_name: string;
  score?: number;
  dailyScore?: number;
  monthlyScore?: number;
  lastUpdated?: string;
  lastUpdatedMonthly?: string;
  availableLines?: number;
  previousRank?: number;
}

export interface ILevel {
  id?: number;
  external_id: string;
  name: string;
  numberOfCodeLines: string;
  imgUrl: string;
  xlevel: string;
  maxLines: string;
}
