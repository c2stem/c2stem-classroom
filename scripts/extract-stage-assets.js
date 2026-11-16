/**
 * Regenerates public/stage-render/ (images + manifest.json), which
 * src/services/StageRender.js uses to redraw engineering design stages in
 * the Compare view.
 *
 * Dev-time tool only: its output is committed and served as static files,
 * so nothing here runs on the server. Needs only Node (no packages).
 *
 * Re-run whenever the UVA-ED-project template's stage changes:
 *   curl -o uva-ed.xml "https://spiceeditor.c2-stem.org/api/RawPublic?Username=uva&ProjectName=UVA-ED-project"
 *   node scripts/extract-stage-assets.js uva-ed.xml public/stage-render
 *
 * Reads the stage background, tile sprites (single-letter names), gauges,
 * visible static sprites and visible global watchers, with their positions,
 * scales and rotation centres. All tiles share one image per material.
 */
const fs = require("fs");
const path = require("path");

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error("usage: node extract-stage-assets.js <project.xml> <outDir>");
  process.exit(1);
}

const TILE_NAME = /^[A-Z]$/;
const MATERIALS = [
  "clear",
  "concrete",
  "permeable concrete",
  "grass",
  "wood chips",
  "artificial turf",
  "poured rubber",
  "riparian buffer",
];

const xml = fs.readFileSync(src, "utf8");
const mediaStart = xml.indexOf("<media");
const body = xml.slice(0, mediaStart);
const media = xml.slice(mediaStart);

const attrs = (tag) => {
  const result = {};
  for (const m of tag.matchAll(/([\w-]+)="([^"]*)"/g)) result[m[1]] = m[2];
  return result;
};
const slug = (name) => name.replace(/ /g, "-");
const costumeRefs = (segment) => {
  const start = segment.indexOf("<costumes>");
  const end = segment.indexOf("</costumes>", start);
  return [...segment.slice(start, end).matchAll(/mediaID="([^"]+)"/g)].map(
    (m) => m[1]
  );
};

// mediaID -> costume attributes (image data URL, rotation centre)
const costumes = {};
for (const m of media.matchAll(/<costume ([^>]*?)(?:\/>|>)/g)) {
  const a = attrs(m[1]);
  if (a.mediaID) costumes[a.mediaID] = a;
}

function save(mediaID, file) {
  const costume = costumes[mediaID];
  if (!costume) throw new Error("missing costume " + mediaID);
  const target = path.join(out, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(
    target,
    Buffer.from(costume.image.split(",", 2)[1], "base64")
  );
  return { cx: Number(costume["center-x"]), cy: Number(costume["center-y"]) };
}

fs.rmSync(out, { recursive: true, force: true });
const manifest = {
  source: path.basename(src),
  stage: { width: 480, height: 360 },
  background: "background.png",
  tileMaterials: {},
  tileCenter: null,
  layers: [],
  watchers: [],
};

// stage background = the stage's current costume
const stageAt = body.indexOf("<stage ");
const stageAttrs = attrs(body.slice(stageAt, body.indexOf(">", stageAt)));
const stageRefs = costumeRefs(body.slice(stageAt));
save(stageRefs[Number(stageAttrs.costume) - 1], manifest.background);

// sprites, in stage order (back to front)
const sprites = [...body.matchAll(/<sprite ([^>]*)>/g)];
sprites.forEach((m, i) => {
  const a = attrs(m[1]);
  const end = i + 1 < sprites.length ? sprites[i + 1].index : body.length;
  const refs = costumeRefs(body.slice(m.index, end));
  const name = a.name;
  const layer = {
    name,
    x: Number(a.x),
    y: Number(a.y),
    scale: Number(a.scale),
  };
  if (TILE_NAME.test(name)) {
    refs.forEach((ref) => {
      const material = ref.split("_cst_")[1];
      if (MATERIALS.includes(material) && !manifest.tileMaterials[material]) {
        const file = `tiles/${slug(material)}.png`;
        manifest.tileCenter = save(ref, file);
        manifest.tileMaterials[material] = file;
      }
    });
    layer.type = "tile";
  } else if (name.endsWith("gauge")) {
    const prefix = `gauges/${slug(name)}-`;
    let centre;
    refs.forEach((ref) => {
      centre = save(ref, `${prefix}${ref.split("_cst_")[1]}.png`);
    });
    Object.assign(layer, {
      type: "gauge",
      gauge: name.split(" ")[0],
      prefix,
      ...centre,
    });
  } else if (a.hidden === "true") {
    return;
  } else {
    const file = `${slug(name)}.png`;
    const centre = save(refs[Number(a.costume || 1) - 1], file);
    Object.assign(layer, { type: "static", image: file, ...centre });
  }
  manifest.layers.push(layer);
});

// visible global variable watchers (stage-relative top-left)
for (const m of body.matchAll(/<watcher ([^>]*)>/g)) {
  const a = attrs(m[1]);
  if (a.hidden === "true" || a.scope || a.style !== "normal") continue;
  manifest.watchers.push({ var: a.var, x: Number(a.x), y: Number(a.y) });
}

fs.writeFileSync(
  path.join(out, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log(
  `wrote ${out}: ${Object.keys(manifest.tileMaterials).length} materials, ` +
    `${manifest.layers.length} layers, ${manifest.watchers.length} watchers`
);
