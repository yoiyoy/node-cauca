import autoIncrement from 'mongoose-auto-increment';
import bear from './bear';

// models used for mongoose
export default function(mongoose) {
  autoIncrement.initialize(mongoose);
  const plugins = [
    autoIncrement.plugin
  ];

  bear(mongoose, plugins);
};
