export function normalizeAccountEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function emailLookupVariants(email) {
  const clean = normalizeAccountEmail(email);
  const variants = new Set();
  if (!clean) return [];
  variants.add(clean);

  const at = clean.lastIndexOf("@");
  if (at <= 0) return [...variants];

  const local = clean.slice(0, at);
  const domain = clean.slice(at + 1);
  const isGmail = domain === "gmail.com" || domain === "googlemail.com";
  if (isGmail) {
    const localNoPlus = local.split("+")[0];
    const compact = localNoPlus.replace(/\./g, "");
    variants.add(`${localNoPlus}@gmail.com`);
    variants.add(`${localNoPlus}@googlemail.com`);
    variants.add(`${compact}@gmail.com`);
    variants.add(`${compact}@googlemail.com`);
  }

  return [...variants];
}

export async function findModelByEmail(Model, email) {
  const variants = emailLookupVariants(email);
  for (const variant of variants) {
    const found = await Model.findOne({
      "emailId.email": { $regex: new RegExp(`^${escapeRegex(variant)}$`, "i") },
    });
    if (found) return found;
  }

  const clean = normalizeAccountEmail(email);
  const at = clean.lastIndexOf("@");
  if (at > 0) {
    const domain = clean.slice(at + 1);
    if (domain === "gmail.com" || domain === "googlemail.com") {
      const compactLocal = clean.slice(0, at).split("+")[0].replace(/\./g, "");
      if (compactLocal) {
        const dottedPattern = `^${compactLocal
          .split("")
          .map(escapeRegex)
          .join("\\.?")}(\\+.*)?@(gmail|googlemail)\\.com$`;
        const found = await Model.findOne({
          "emailId.email": { $regex: new RegExp(dottedPattern, "i") },
        });
        if (found) return found;
      }
    }
  }

  return null;
}

export async function findAnyAccountByEmail(models, email) {
  for (const { model, type } of models) {
    const doc = await findModelByEmail(model, email);
    if (doc) return { doc, type };
  }
  return null;
}
