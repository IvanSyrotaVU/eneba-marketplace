const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const STEAM = (appId: number, file = "library_600x900.jpg") =>
  `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/${file}`;

const svgCard = (c1: string, c2: string, badge: string, title: string, sub: string, iconPaths: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="600" height="800" fill="url(%23g)"/><circle cx="300" cy="270" r="130" fill="%23ffffff" opacity="0.06"/>${iconPaths}<text x="50%" y="61%" dominant-baseline="middle" text-anchor="middle" fill="%23fad318" font-family="sans-serif" font-weight="900" font-size="26" letter-spacing="4">${badge}</text><text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-weight="900" font-size="42">${title}</text><text x="50%" y="74%" dominant-baseline="middle" text-anchor="middle" fill="%2300e08f" font-family="sans-serif" font-weight="700" font-size="20" letter-spacing="4">${sub}</text></svg>`;

function pickCover(title: string, current?: string, isHero = false): string {
  const t = title.toLowerCase();
  if (t.includes("phantom liberty")) return STEAM(2138330);
  if (t.includes("cyberpunk")) return STEAM(1091500);
  if (t.includes("shadow of the erdtree")) return STEAM(2778580);
  if (t.includes("elden")) return STEAM(1245620);
  if (t.includes("baldur")) return STEAM(1086940);
  if (t.includes("hogwarts")) return STEAM(990080);
  if (t.includes("red dead")) return STEAM(1174180);
  if (t.includes("starfield")) return STEAM(1716740);
  if (t.includes("forza")) return STEAM(1551360);
  if (t.includes("witcher")) return STEAM(292030);
  if (t.includes("gta vi") || t.includes("grand theft auto vi")) return "/img/gta6.webp";
  if (t.includes("gta") || t.includes("grand theft auto")) return STEAM(271590);
  if (t.includes("neon ronin") || t.includes("ghostrunner")) {
    return isHero ? STEAM(2144740, "library_hero.jpg") : STEAM(2144740);
  }

  // Distinct Software covers
  if (t.includes("windows 11")) {
    return svgCard("%230078d4", "%23120529", "OPERATING SYSTEM", "Windows 11 Pro", "GLOBAL RETAIL KEY",
      '<rect x="215" y="185" width="78" height="78" rx="8" fill="%2338bdf8"/><rect x="307" y="185" width="78" height="78" rx="8" fill="%2338bdf8"/><rect x="215" y="277" width="78" height="78" rx="8" fill="%2338bdf8"/><rect x="307" y="277" width="78" height="78" rx="8" fill="%2338bdf8"/>');
  }
  if (t.includes("office 2024")) {
    return svgCard("%23ea580c", "%23120529", "PRODUCTIVITY SUITE", "Office 2024 Home", "LIFETIME PC LICENSE",
      '<rect x="225" y="185" width="150" height="170" rx="22" fill="%23fb923c"/><rect x="255" y="220" width="90" height="16" rx="8" fill="%23120529"/><rect x="255" y="254" width="90" height="16" rx="8" fill="%23120529"/><rect x="255" y="288" width="60" height="16" rx="8" fill="%23120529"/>');
  }
  if (t.includes("nordvpn")) {
    return svgCard("%232563eb", "%23120529", "CYBERSECURITY", "NordVPN Complete", "1 YEAR • EUROPE",
      '<path d="M300 175 L385 212 V282 C385 335 348 374 300 392 C252 374 215 335 215 282 V212 Z" fill="%2360a5fa"/><path d="M268 282 L292 306 L338 256" stroke="%23120529" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>');
  }
  if (t.includes("photoshop")) {
    return svgCard("%230284c7", "%23120529", "CREATIVE SUITE", "Photoshop 2025", "ELEMENTS • US",
      '<rect x="210" y="180" width="180" height="180" rx="32" fill="%23001e36" stroke="%2331a8ff" stroke-width="10"/><text x="300" y="295" text-anchor="middle" fill="%2331a8ff" font-family="sans-serif" font-weight="900" font-size="92">Ps</text>');
  }

  // Distinct Gift Card covers
  if (t.includes("steam wallet")) {
    return svgCard("%231b2838", "%234e1bd9", "STEAM WALLET", "€20 Gift Card", "EUROPE REGION",
      '<rect x="200" y="205" width="200" height="130" rx="22" fill="%23ffffff" opacity="0.14"/><path d="M200 255 H400 M300 205 V335" stroke="%23fad318" stroke-width="14"/>');
  }
  if (t.includes("playstation")) {
    return svgCard("%2300439c", "%23120529", "PLAYSTATION STORE", "€50 Gift Card", "EUROPE PSN",
      '<rect x="200" y="205" width="200" height="130" rx="22" fill="%23ffffff" opacity="0.14"/><path d="M200 255 H400 M300 205 V335" stroke="%2338bdf8" stroke-width="14"/>');
  }
  if (t.includes("xbox")) {
    return svgCard("%23107c10", "%23120529", "XBOX LIVE STORE", "$25 Gift Card", "UNITED STATES",
      '<circle cx="300" cy="270" r="78" fill="%23ffffff" opacity="0.16"/><path d="M258 228 L342 312 M342 228 L258 312" stroke="%2300e08f" stroke-width="16" stroke-linecap="round"/>');
  }
  if (t.includes("eshop") || t.includes("nintendo")) {
    return svgCard("%23e60012", "%23120529", "NINTENDO ESHOP", "€15 Gift Card", "EUROPE SWITCH",
      '<rect x="215" y="195" width="75" height="150" rx="24" fill="%23ffffff" opacity="0.22"/><rect x="310" y="195" width="75" height="150" rx="24" fill="%23fad318" opacity="0.85"/>');
  }

  return current || STEAM(1091500);
}

function normalizeData<T>(node: T, isHero = false): T {
  if (Array.isArray(node)) {
    return node.map((item) => normalizeData(item, false)) as unknown as T;
  }
  if (node && typeof node === "object") {
    const obj = { ...(node as Record<string, unknown>) };
    if (typeof obj.title === "string") {
      if (obj.title.includes("Neon Ronin: Afterglow")) {
        obj.title = obj.title.replace("Neon Ronin: Afterglow", "Ghostrunner 2");
        if (typeof obj.description === "string") {
          obj.description =
            "Slash your way through a post-apocalyptic cyberpunk tower in this high-speed first-person action thriller. Instant digital key delivery.";
        }
      }
      if ("cover" in obj) {
        obj.cover = pickCover(
          obj.title,
          typeof obj.cover === "string" ? obj.cover : undefined,
          isHero,
        );
      }
    }
    for (const k of Object.keys(obj)) {
      if (obj[k] && typeof obj[k] === "object") {
        obj[k] = normalizeData(obj[k], k === "hero");
      }
    }
    return obj as T;
  }
  return node;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("eneba.token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return normalizeData(data) as T;
}