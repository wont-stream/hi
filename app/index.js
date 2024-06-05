import DB from "./db";
const db = await DB("./db.json");

import files from "./imports";

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
  return new Response(files.indexHTML, {
    headers: {
      "content-type": "text/html",
    },
  });
};

app.GET["/index.js"] = async () => {
  return new Response(files.indexJS, {
    headers: {
      "content-type": "text/javascript",
    },
  });
};

app.GET["/templates/tableItem"] = async () => {
  return new Response(files.tableItemHTML, {
    headers: {
      "content-type": "text/html",
    },
  });
};

app.GET["/templates/divider"] = async () => {
  return new Response(files.dividerHTML, {
    headers: {
      "content-type": "text/html",
    },
  });
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
