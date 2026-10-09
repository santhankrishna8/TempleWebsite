// Site languages. Devotional text (slokas, stotras, names) is TRANSLITERATED letter by letter, the way stotra books
// print the same Sanskrit in every script, so the words never change. Interface text (menus, buttons, notes) is
// TRANSLATED via UI below. The whole page is converted at the DOM level, so templates stay in Telugu.
//
//   en: everyday devotional spelling (Sri Krishna, Om Namo Bhagavate), see EN below
//   kn: Telugu and Kannada Unicode blocks are parallel: same letter, +0x80
//   ta: Sanskrit-in-Tamil convention: க க² க³ க⁴ = ka kha ga gha, ருʼ = ṛ (as on stotra sites)

export type Lang = 'te' | 'en' | 'ta' | 'kn';
export const LANGS: { code: Lang; name: string }[] = [
  { code: 'te', name: 'తెలుగు' }, { code: 'en', name: 'English' }, { code: 'ta', name: 'தமிழ்' }, { code: 'kn', name: 'ಕನ್ನಡ' },
];

// ---- transliteration (index = code point - 0x0C00) ----

const isCons = (c: number) => c >= 0x15 && c <= 0x39;
// Telugu ం before a consonant is pronounced as that consonant's own nasal (గోవింద = gōvinda)
const nasalClass = (c: number) => (c >= 0x15 && c <= 0x19 ? 0 : c >= 0x1a && c <= 0x1e ? 1 : c >= 0x1f && c <= 0x23 ? 2 : c >= 0x24 && c <= 0x28 ? 3 : c >= 0x2a && c <= 0x2e ? 4 : -1);

// English: the everyday devotional spelling (Om Namo Bhagavate, Sri Krishna, Venkateswara), no accent marks.
// శ/ష = sh (but శ్రీ = Sri, శ్వ = sw: Venkateswara), ఋ = ri, వ after స/శ/ష/ద/త/ధ = w (Swami, Dwi, Vishwa), every word capitalised.
const EN = {
  cons: { 0x15: 'k', 0x16: 'kh', 0x17: 'g', 0x18: 'gh', 0x19: 'n', 0x1a: 'ch', 0x1b: 'chh', 0x1c: 'j', 0x1d: 'jh', 0x1e: 'n',
    0x1f: 't', 0x20: 'th', 0x21: 'd', 0x22: 'dh', 0x23: 'n', 0x24: 't', 0x25: 'th', 0x26: 'd', 0x27: 'dh', 0x28: 'n',
    0x2a: 'p', 0x2b: 'ph', 0x2c: 'b', 0x2d: 'bh', 0x2e: 'm', 0x2f: 'y', 0x30: 'r', 0x31: 'r', 0x32: 'l', 0x33: 'l', 0x34: 'l',
    0x35: 'v', 0x36: 'sh', 0x37: 'sh', 0x38: 's', 0x39: 'h' } as Record<number, string>,
  vowel: { 0x05: 'a', 0x06: 'a', 0x07: 'i', 0x08: 'i', 0x09: 'u', 0x0a: 'u', 0x0b: 'ri', 0x0c: 'li', 0x0e: 'e', 0x0f: 'e',
    0x10: 'ai', 0x12: 'o', 0x13: 'o', 0x14: 'au', 0x60: 'ri', 0x61: 'li' } as Record<number, string>,
  sign: { 0x3e: 'a', 0x3f: 'i', 0x40: 'i', 0x41: 'u', 0x42: 'u', 0x43: 'ri', 0x44: 'ri', 0x46: 'e', 0x47: 'e', 0x48: 'ai',
    0x4a: 'o', 0x4b: 'o', 0x4c: 'au', 0x62: 'li', 0x63: 'li' } as Record<number, string>,
  nasal: ['n', 'n', 'n', 'n', 'm'],
  other: { 0x01: 'm', 0x02: 'm', 0x03: 'h', 0x3d: "'", 0x55: '', 0x56: '' } as Record<number, string>,
};

// Capitalise a romanised piece when it starts a word
const startCase = (out: string, piece: string) => (/\p{L}$/u.test(out) ? piece : piece.charAt(0).toUpperCase() + piece.slice(1));

const TA = {
  // [letter, superscript]
  cons: { 0x15: ['க', ''], 0x16: ['க', '²'], 0x17: ['க', '³'], 0x18: ['க', '⁴'], 0x19: ['ங', ''], 0x1a: ['ச', ''], 0x1b: ['ச', '²'],
    0x1c: ['ஜ', ''], 0x1d: ['ஜ', '²'], 0x1e: ['ஞ', ''], 0x1f: ['ட', ''], 0x20: ['ட', '²'], 0x21: ['ட', '³'], 0x22: ['ட', '⁴'],
    0x23: ['ண', ''], 0x24: ['த', ''], 0x25: ['த', '²'], 0x26: ['த', '³'], 0x27: ['த', '⁴'], 0x28: ['ந', ''], 0x2a: ['ப', ''],
    0x2b: ['ப', '²'], 0x2c: ['ப', '³'], 0x2d: ['ப', '⁴'], 0x2e: ['ம', ''], 0x2f: ['ய', ''], 0x30: ['ர', ''], 0x31: ['ற', ''],
    0x32: ['ல', ''], 0x33: ['ள', ''], 0x34: ['ழ', ''], 0x35: ['வ', ''], 0x36: ['ஶ', ''], 0x37: ['ஷ', ''], 0x38: ['ஸ', ''],
    0x39: ['ஹ', ''] } as Record<number, [string, string]>,
  vowel: { 0x05: 'அ', 0x06: 'ஆ', 0x07: 'இ', 0x08: 'ஈ', 0x09: 'உ', 0x0a: 'ஊ', 0x0b: 'ருʼ', 0x0c: 'லுʼ', 0x0e: 'எ', 0x0f: 'ஏ',
    0x10: 'ஐ', 0x12: 'ஒ', 0x13: 'ஓ', 0x14: 'ஔ', 0x60: 'ரூʼ', 0x61: 'லூʼ' } as Record<number, string>,
  // vowel sign written on the letter, and anything after the superscript (ṛ = ்ருʼ)
  sign: { 0x3e: ['ா', ''], 0x3f: ['ி', ''], 0x40: ['ீ', ''], 0x41: ['ு', ''], 0x42: ['ூ', ''], 0x43: ['்', 'ருʼ'], 0x44: ['்', 'ரூʼ'],
    0x46: ['ெ', ''], 0x47: ['ே', ''], 0x48: ['ை', ''], 0x4a: ['ொ', ''], 0x4b: ['ோ', ''], 0x4c: ['ௌ', ''], 0x4d: ['்', ''],
    0x62: ['்', 'லுʼ'], 0x63: ['்', 'லூʼ'] } as Record<number, [string, string]>,
  nasal: ['ங்', 'ஞ்', 'ண்', 'ந்', 'ம்'],
  other: { 0x01: 'ம்', 0x02: 'ம்', 0x03: 'ஃ', 0x3d: '’', 0x55: '', 0x56: '' } as Record<number, string>,
};

const tel = (ch: string) => { const c = ch.codePointAt(0)! - 0x0c00; return c >= 0 && c < 0x80 ? c : -1; };

export function transliterate(text: string, lang: Lang): string {
  if (lang === 'te' || !/[ఀ-౿]/.test(text)) return text;
  if (lang === 'kn') {
    return text.replace(/[ఀ-౿]/g, ch => {
      const c = tel(ch);
      if (c === 0x01) return 'ಂ';            // arasunna → anusvara (spacing candrabindu is poorly supported in fonts)
      if (c === 0x34) return 'ೞ';            // ఴ → ೞ
      return String.fromCodePoint(0x0c80 + c);
    });
  }
  const chars = Array.from(text);
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const c = tel(chars[i]);
    if (c < 0) { out += chars[i]; continue; }
    const next = i + 1 < chars.length ? tel(chars[i + 1]) : -1;
    if (c >= 0x66 && c <= 0x6f) { out += String(c - 0x66); continue; }          // digits
    if (c === 0x02) {                                                          // anusvara
      const k = nasalClass(next);
      out += k >= 0 ? (lang === 'en' ? EN.nasal : TA.nasal)[k] : (lang === 'en' ? EN.other : TA.other)[c];
      continue;
    }
    if (isCons(c)) {
      const prev2 = i > 1 && tel(chars[i - 1]) === 0x4d ? tel(chars[i - 2]) : -1;   // consonant joined before this one
      const sign = next >= 0x3e && next <= 0x63 && next !== 0x55 && next !== 0x56 ? next : -1;
      if (sign >= 0) i++;
      if (lang === 'en') {
        const after = i + 1 < chars.length ? tel(chars[i + 1]) : -1;
        let cons = EN.cons[c] ?? '';
        const sri = after === 0x30 && i + 2 < chars.length && tel(chars[i + 2]) === 0x40;
        if (c === 0x36 && sign === 0x4d && (sri || after === 0x35)) cons = 's';             // శ్రీ Sri, శ్వ swara (but శ్ర shr: Ashraya)
        if (c === 0x35 && [0x38, 0x36, 0x37, 0x26, 0x24, 0x27].includes(prev2)) cons = 'w';  // Swami, Dwi, Vishwa (but Parvati, Sarva)
        out += startCase(out, cons + (sign === 0x4d ? '' : sign >= 0 ? EN.sign[sign] ?? '' : 'a'));
      } else {
        const [letter, sup] = TA.cons[c] ?? ['', ''];
        const [mark, tail] = sign >= 0 ? TA.sign[sign] ?? ['', ''] : ['', ''];
        out += letter + mark + sup + tail;
      }
      continue;
    }
    const t = lang === 'en' ? EN.vowel[c] ?? EN.other[c] : TA.vowel[c] ?? TA.other[c];
    out += t === undefined ? chars[i] : lang === 'en' && EN.vowel[c] ? startCase(out, t) : t;
  }
  return out;
}

// ---- interface translations (exact phrases, matched as whole words) ----

const UI: Record<string, Partial<Record<Lang, string>>> = {
  'హోమ్': { en: 'Home', ta: 'முகப்பு', kn: 'ಮುಖಪುಟ' },
  'పూజ విధానం': { en: 'Puja Vidhanam', ta: 'பூஜா விதானம்', kn: 'ಪೂಜಾ ವಿಧಾನ' },
  'ఫోటోలు': { en: 'Photos', ta: 'படங்கள்', kn: 'ಫೋಟೋಗಳು' },
  'సంప్రదించండి': { en: 'Contact', ta: 'தொடர்பு', kn: 'ಸಂಪರ್ಕಿಸಿ' },
  'ప్రధాన': { en: 'Main', ta: 'முதன்மை', kn: 'ಮುಖ್ಯ' },
  'ఫుటర్': { en: 'Footer', ta: 'அடிக்குறிப்பு', kn: 'ಅಡಿಟಿಪ್ಪಣಿ' },
  'సెట్టింగ్స్': { en: 'Settings', ta: 'அமைப்பு', kn: 'ಸೆಟ್ಟಿಂಗ್ಸ್' },  // short: also the phone tab label
  'భాష': { en: 'Language', ta: 'மொழி', kn: 'ಭಾಷೆ' },
  'థీమ్': { en: 'Theme', ta: 'தீம்', kn: 'ಥೀಮ್' },
  'లైట్': { en: 'Light', ta: 'வெளிர்', kn: 'ಲೈಟ್' },
  'డార్క్': { en: 'Dark', ta: 'இருண்ட', kn: 'ಡಾರ್ಕ್' },

  'శ్రీ కృష్ణ భజన మందిరము': { en: 'Sri Krishna Bhajana Mandiram', ta: 'ஸ்ரீ கிருஷ்ண பஜனை மந்திரம்', kn: 'ಶ್ರೀ ಕೃಷ್ಣ ಭಜನ ಮಂದಿರ' },
  'శ్రీ కృష్ణ భజన మందిరం': { en: 'Sri Krishna Bhajana Mandiram', ta: 'ஸ்ரீ கிருஷ்ண பஜனை மந்திரம்', kn: 'ಶ್ರೀ ಕೃಷ್ಣ ಭಜನ ಮಂದಿರ' },
  'పేరూరు గ్రామం, తిరుపతి జిల్లా': { en: 'Peruru Village, Tirupati District', ta: 'பேரூரு கிராமம், திருப்பதி மாவட்டம்', kn: 'ಪೇರೂರು ಗ್ರಾಮ, ತಿರುಪತಿ ಜಿಲ್ಲೆ' },
  'పేరూరు గ్రామం, తిరుపతి రూరల్': { en: 'Peruru Village, Tirupati Rural', ta: 'பேரூரு கிராமம், திருப்பதி ஊரகம்', kn: 'ಪೇರೂರು ಗ್ರಾಮ, ತಿರುಪತಿ ಗ್ರಾಮಾಂತರ' },
  'పేరూరు': { en: 'Peruru', ta: 'பேரூரு', kn: 'ಪೇರೂರು' },
  'ఆలయ స్థానం': { en: 'Temple location', ta: 'கோயில் இருப்பிடம்', kn: 'ದೇವಾಲಯದ ಸ್ಥಳ' },
  'దారి చూపించు': { en: 'Get directions', ta: 'வழி காட்டு', kn: 'ದಾರಿ ತೋರಿಸು' },
  'ధర్మకర్త': { en: 'Trustee', ta: 'தர்மகர்த்தா', kn: 'ಧರ್ಮದರ್ಶಿ' },
  'అర్చకులు': { en: 'Priest', ta: 'அர்ச்சகர்', kn: 'ಅರ್ಚಕರು' },
  'శ్రీ నల్లందుల సిద్ధా రెడ్డి': { en: 'Sri Nallandula Siddha Reddy', ta: 'ஸ்ரீ நல்லந்துல சித்தா ரெட்டி', kn: 'ಶ್ರೀ ನಲ್ಲಂದುಲ ಸಿದ್ಧಾ ರೆಡ್ಡಿ' },
  'శ్రీ వేలవేటి బాలకృష్ణ': { en: 'Sri Velaveti Balakrishna', ta: 'ஸ்ரீ வேலவேடி பாலகிருஷ்ணா', kn: 'ಶ್ರೀ ವೇಲವೇಟಿ ಬಾಲಕೃಷ್ಣ' },

  'ఆలయ చిత్రాలు': { en: 'Temple photos', ta: 'கோயில் படங்கள்', kn: 'ದೇವಾಲಯದ ಚಿತ್ರಗಳು' },
  'ఆలయ చిత్రం': { en: 'Temple photo', ta: 'கோயில் படம்', kn: 'ದೇವಾಲಯದ ಚಿತ್ರ' },
  'చిత్రం': { en: 'Photo', ta: 'படம்', kn: 'ಚಿತ್ರ' },
  'మునుపటి': { en: 'Previous', ta: 'முந்தைய', kn: 'ಹಿಂದಿನ' },
  'తదుపరి': { en: 'Next', ta: 'அடுத்து', kn: 'ಮುಂದಿನ' },
  'మూసివేయి': { en: 'Close', ta: 'மூடு', kn: 'ಮುಚ್ಚಿ' },
  'పెద్దగా చూడండి': { en: 'view large', ta: 'பெரிதாகப் பாருங்கள்', kn: 'ದೊಡ್ಡದಾಗಿ ನೋಡಿ' },
  'ఆలయ దర్శనం · చిత్రాన్ని నొక్కి పెద్దగా చూడండి': { en: 'Temple darshan · tap a photo to view it large', ta: 'கோயில் தரிசனம் · படத்தைத் தொட்டுப் பெரிதாகப் பாருங்கள்', kn: 'ದೇವಾಲಯ ದರ್ಶನ · ಚಿತ್ರವನ್ನು ಒತ್ತಿ ದೊಡ್ಡದಾಗಿ ನೋಡಿ' },
  'పేజీలు · చదవడానికి నొక్కండి': { en: 'pages · tap to read', ta: 'பக்கங்கள் · படிக்கத் தொடவும்', kn: 'ಪುಟಗಳು · ಓದಲು ಒತ್ತಿ' },
  'పేజీ': { en: 'page', ta: 'பக்கம்', kn: 'ಪುಟ' },
  'ఘట్టాలు': { en: 'Steps', ta: 'படிகள்', kn: 'ಹಂತಗಳು' },
  'గోవింద నామాలు': { en: 'Govinda Namalu', ta: 'கோவிந்த நாமங்கள்', kn: 'ಗೋವಿಂದ ನಾಮಗಳು' },

  // Instruction notes inside the puja steps (Telugu prose, not mantra). English shows the Telugu romanised, as asked.
  '(అని మూడు సార్లు నీటిని తాగవలయును. తదుపరి హస్తము శుద్ధి చేసుకొని నమస్కరించుకొనవలయును)': {
    ta: '(என்று சொல்லி மூன்று முறை நீரை அருந்த வேண்டும். பின்னர் கைகளைச் சுத்தம் செய்துகொண்டு நமஸ்கரிக்க வேண்டும்)',
    kn: '(ಎಂದು ಹೇಳಿ ಮೂರು ಬಾರಿ ನೀರನ್ನು ಕುಡಿಯಬೇಕು. ನಂತರ ಕೈಗಳನ್ನು ಶುದ್ಧಿ ಮಾಡಿಕೊಂಡು ನಮಸ್ಕರಿಸಬೇಕು)' },
  '(అని అక్షతలు వాసన చూసి వెనక వదలవలయును)': {
    ta: '(என்று சொல்லி அட்சதையை முகர்ந்து பார்த்துப் பின்னால் போட வேண்டும்)',
    kn: '(ಎಂದು ಹೇಳಿ ಅಕ್ಷತೆಯನ್ನು ಮೂಸಿ ನೋಡಿ ಹಿಂದೆ ಹಾಕಬೇಕು)' },
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const uiRe: Partial<Record<Lang, RegExp>> = {};
function uiPattern(lang: Lang) {
  // longest first, so a phrase wins over a word inside it; never match inside a longer Telugu word
  const keys = Object.keys(UI).filter(k => UI[k][lang]).sort((a, b) => b.length - a.length).map(esc);
  return (uiRe[lang] ??= new RegExp(`(?<![\\u0C00-\\u0C7F])(?:${keys.join('|')})(?![\\u0C00-\\u0C7F])`, 'g'));
}

export function convert(text: string, lang: Lang): string {
  if (lang === 'te' || !/[ఀ-౿]/.test(text)) return text;
  return transliterate(text.replace(uiPattern(lang), m => UI[m][lang]!), lang);
}

// ---- DOM: convert every text node and label attribute, and keep converting what Angular renders later ----

const SKIP = 'script, style, textarea, input, [translate="no"]';
const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
type Rec = { orig: string; out: string };
const texts = new WeakMap<Text, Rec>();
const attrs = new WeakMap<Element, Map<string, Rec>>();
let lang: Lang = 'te';
let titleOrig = '';

// A value equal to what we last wrote is ours; anything else is new Telugu from Angular and becomes the original.
function fresh(rec: Rec | undefined, now: string): Rec {
  return rec && now === rec.out ? rec : { orig: now, out: now };
}

function doText(n: Text) {
  if (n.parentElement?.closest(SKIP)) return;
  const rec = fresh(texts.get(n), n.data);
  rec.out = convert(rec.orig, lang);
  texts.set(n, rec);
  if (n.data !== rec.out) n.data = rec.out;
}

function doAttr(el: Element, name: string) {
  const now = el.getAttribute(name);
  if (now === null || el.closest(SKIP)) return;
  const map = attrs.get(el) ?? new Map<string, Rec>();
  const rec = fresh(map.get(name), now);
  rec.out = convert(rec.orig, lang);
  map.set(name, rec);
  attrs.set(el, map);
  if (now !== rec.out) el.setAttribute(name, rec.out);
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return doText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE || (root as Element).closest(SKIP)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.nodeType === Node.ELEMENT_NODE && (n as Element).matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n: Node | null = w.currentNode; n; n = w.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) doText(n as Text);
    else ATTRS.forEach(a => doAttr(n as Element, a));
  }
}

export function currentLang(): Lang { return lang; }

export function setLang(next: Lang) {
  lang = next;
  document.documentElement.lang = next;
  try { localStorage.setItem('lang', next); } catch { /* private mode: choice just won't persist */ }
  document.title = convert(titleOrig, next);
  walk(document.body);
}

export function startI18n() {
  titleOrig = document.title;
  new MutationObserver(muts => {
    if (lang === 'te') return; // nothing to convert; originals are already Telugu
    for (const m of muts) {
      if (m.type === 'childList') m.addedNodes.forEach(walk);
      else if (m.type === 'characterData') doText(m.target as Text);
      else if (m.attributeName) doAttr(m.target as Element, m.attributeName);
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  let saved: string | null = null;
  try { saved = localStorage.getItem('lang'); } catch { /* ignore */ }
  setLang(LANGS.some(l => l.code === saved) ? (saved as Lang) : 'te');
}
