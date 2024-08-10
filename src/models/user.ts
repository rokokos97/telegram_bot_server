import { Schema, model } from 'mongoose';
import { type IUser } from '../interfaces';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, sparse: true },
    first_name: { type: String },
    last_name: { type: String },
    score: { type: Number },
    dailyScore: { type: Number },
    monthlyScore: { type: Number },
    lastUpdated: { type: String },
    lastUpdatedMonthly: { type: String },
    availableLines: { type: Number },
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>('UserModel', userSchema);
export default UserModel;
