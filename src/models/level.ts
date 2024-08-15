import { DataTypes } from 'sequelize';
import { sequelize } from '../database';

const Level = sequelize.define(
  'Level',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    external_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    numberOfCodeLines: {
      type: DataTypes.STRING,
    },
    imgUrl: {
      type: DataTypes.STRING,
    },
    xlevel: {
      type: DataTypes.STRING,
    },
    maxLines: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: 'Levels',
  },
);

export default Level;
