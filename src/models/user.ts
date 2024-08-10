import { DataTypes } from 'sequelize';
import { sequelize } from '../index';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dailyScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    monthlyScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastUpdated: {
      type: DataTypes.DATEONLY,
    },
    lastUpdatedMonthly: {
      type: DataTypes.STRING,
    },
    availableLines: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
  },
  {
    timestamps: false,
  },
);

export default User;
