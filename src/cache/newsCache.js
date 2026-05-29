const store = new Map();

module.exports = {
  get(key) {
    return store.get(key) || null;
  },
  set(key, data) {
    store.set(key, { data, updatedAt: new Date().toISOString() });
  },
  getWithMeta(key) {
    return store.get(key) || null;
  },
  keys() {
    return [...store.keys()];
  },
};
