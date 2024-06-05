module.exports = async (filePath) => {
  const db = Bun.file(filePath);

  if (!(await db.exists())) {
    await Bun.write(db, "{}");
  }

  const set = async (key, value) => {
    const json = await db.json();
    json[key] = value;
    return Bun.write(db, JSON.stringify(json));
  };

  const get = async (key) => {
    const json = await db.json();
    return json[key];
  };

  const has = async (key) => {
    const json = await db.json();
    return json.hasOwnProperty(key);
  };

  const remove = async (key) => {
    const json = await db.json();
    delete json[key];
    return Bun.write(db, JSON.stringify(json));
  };

  const removeAll = async () => {
    return Bun.write(db, "{}");
  };

  return { set, get, has, remove, removeAll };
};
