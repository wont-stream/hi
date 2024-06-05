const DB = require("./db");
const db = await DB("./db.json");

const app = {
  GET: {},
  POST: {},
};

Bun.serve({
  async fetch(req, server) {
    const url = new URL(req.url);
    const path = url.pathname;
    const pathsSlug = path.replace("/", "");

    if (await db.has(pathsSlug)) {
      return Response.redirect(await db.get(pathsSlug), 301);
    }

    if (app) {
      if (app[req.method]) {
        if (app[req.method][path]) {
          return await app[req.method][path](req, server);
        }
      }
    }

    return new Response(404);
  },

  port: 80,
});

app.GET["/"] = async () => {
  return new Response(Bun.file("./frontend/index.html"));
};

app.GET["/index.js"] = async () => {
  return new Response(Bun.file("./frontend/index.js"));
};

app.GET["/templates/tableItem"] = async () => {
  return new Response(Bun.file("./frontend/tableItem.html"));
};

app.GET["/templates/divider"] = async () => {
  return new Response(Bun.file("./frontend/divider.html"));
};

app.GET["/slugs"] = async () => {
  return new Response(Bun.file("./db.json"));
};

app.POST["/create"] = async (req) => {
  const data = await req.json();

  if (!(await db.has(data.slug))) {
    db.set(data.slug, data.url);
  } else {
    return Response.json({ ok: false, msg: "Slug already taken." });
  }

  return Response.json({ ok: true, msg: "Link created." });
};

app.POST["/delete"] = async (req) => {
  const data = await req.json();

  if (await db.has(data.slug)) {
    db.remove(data.slug);
  } else {
    return Response.json({ ok: false, msg: "Slug doesn't exist." });
  }

  return Response.json({ ok: true, msg: "Link deleted." });
};
