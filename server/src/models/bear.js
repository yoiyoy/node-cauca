export default (mongoose, plugins = []) => {
  const schemaName = 'Bear';
  const schema = new mongoose.Schema({
    name: String
  });

  plugins.map(plugin => schema.plugin(plugin, schemaName));
  return mongoose.model(schemaName, schema);
}
