const slugTable = document.getElementById("slugs");
const snackbar = document.getElementById("snackbar");

document.getElementById("create").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.submitter?.id == "reload") {
    return;
  }
  let data = await fetch("/create", {
    method: "POST",
    body: JSON.stringify({
      url: e.target[0].value,
      slug: e.target[1].value,
    }),
  });
  data = await data.json();

  if (!data.ok) {
    snackbar.className = "snackbar error";
    snackbar.innerText = data.msg;
  } else {
    snackbar.className = "snackbar primary";
    snackbar.innerText = data.msg;
  }
  ui(snackbar);

  await loadSlugs();
});

const loadSlugs = async () => {
  let data = await fetch("/slugs");
  data = await data.json();

  let html = "";

  const slugs = Object.keys(data);

  slugs.forEach((slug, i) => {
    html += `<a class="row padding">
          <div class="max">
            <h6 class="small">${slug}</h6>
            <div>${data[slug]}</div>
          </div>
          <button class="border small-round" onclick="deleteSlug('${slug}')">
            <i>close</i>
            <span>Delete</span>
          </button>
        </a>`;
    if (i + 1 !== slugs.length) {
      html += `<div class="divider"></div>`;
    }
  });

  slugTable.innerHTML = html;
};

const deleteSlug = async (slug) => {
  let data = await fetch("/delete", {
    method: "POST",
    body: JSON.stringify({ slug }),
  });
  data = await data.json();

  if (!data.ok) {
    snackbar.className = "snackbar error";
    snackbar.innerText = data.msg;
  } else {
    snackbar.className = "snackbar primary";
    snackbar.innerText = data.msg;
  }
  ui(snackbar);

  await loadSlugs();
};

document.getElementById("reload").onclick = loadSlugs;

loadSlugs();
