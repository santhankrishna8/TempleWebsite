// Self-check for transliteration/translation. Run: node --experimental-strip-types src/app/i18n.check.ts
// (Not part of the Angular build.)
import { convert, transliterate } from './i18n.ts';

const cases: [string, 'en' | 'ta' | 'kn', string][] = [
  ['గోవింద', 'en', 'Govinda'],
  ['గోవింద', 'ta', 'கோ³விந்த³'],
  ['గోవింద', 'kn', 'ಗೋವಿಂದ'],
  ['శ్రీ కృష్ణ', 'en', 'Sri Krishna'],
  ['శ్రీ కృష్ణ', 'ta', 'ஶ்ரீ க்ருʼஷ்ண'],
  ['శ్రీ కృష్ణ', 'kn', 'ಶ್ರೀ ಕೃಷ್ಣ'],
  ['ఓం నమో భగవతే', 'en', 'Om Namo Bhagavate'],
  ['ఓం నమో భగవతే', 'ta', 'ஓம் நமோ ப⁴க³வதே'],
  ['నమః', 'en', 'Namah'],
  ['నమః', 'ta', 'நமஃ'],
  ['సంకల్పం', 'en', 'Sankalpam'],
  ['సంకల్పం', 'ta', 'ஸங்கல்பம்'],
  ['సంకల్పం', 'kn', 'ಸಂಕಲ್ಪಂ'],
  ['శంఖచక్రగదాహస్తే', 'ta', 'ஶங்க²சக்ரக³தா³ஹஸ்தே'],
  ['వేంకటేశ్వర', 'en', 'Venkateswara'],
  ['జ్ఞానము', 'en', 'Jnanamu'],
  ['ఋతౌ', 'en', 'Ritau'],
  ['ఋతౌ', 'ta', 'ருʼதௌ'],
  ['పరబ్రహ్మనే', 'ta', 'பரப்³ரஹ்மநே'],
  ['ధర్మార్థ', 'ta', 'த⁴ர்மார்த²'],
  ['517 505', 'ta', '517 505'],
  ['శ్రీ లక్ష్మీ వేంకటేశ్వరస్వామి పరబ్రహ్మనే నమః', 'en', 'Sri Lakshmi Venkateswaraswami Parabrahmane Namah'],
  ['శ్రీ నరసింహ స్వామి', 'en', 'Sri Narasimha Swami'],
  ['శ్రీ ఆంజనేయ స్వామి', 'en', 'Sri Anjaneya Swami'],
  ['విష్వక్సేన ప్రార్థన', 'en', 'Vishwaksena Prarthana'],
  ['యస్య ద్విరదవక్త్రాద్యాః', 'en', 'Yasya Dwiradavaktradyah'],
  ['శ్రీ విఘ్నేశ్వర స్వామి', 'en', 'Sri Vighneswara Swami'],
  ['ప్రాణాయామం', 'en', 'Pranayamam'],
  ['శ్రీమన్నారాయణ', 'en', 'Srimannarayana'],
  ['క్షమా ప్రార్థన', 'en', 'Kshama Prarthana'],
  ['హరిః ఓం', 'en', 'Harih Om'],
  ['శ్రీ పార్వతీ పరమేశ్వరస్వామి', 'en', 'Sri Parvati Parameswaraswami'],
  ['సర్వం శ్రీ కృష్ణార్పణమస్తు', 'en', 'Sarvam Sri Krishnarpanamastu'],
  ['విష్వక్సేనం తమాశ్రయే', 'en', 'Vishwaksenam Tamashraye'],
  ['శ్రీనివాస', 'en', 'Srinivasa'],
  ['ద్వాదశి', 'en', 'Dwadashi'],
];
let bad = 0;
for (const [te, lang, want] of cases) {
  const got = transliterate(te, lang);
  if (got !== want) { bad++; console.log(`FAIL ${lang} ${te}: got ${got}, want ${want}`); }
}
// UI phrases translate; whole words only; mixed text keeps numbers
const ui: [string, 'en' | 'ta' | 'kn', string][] = [
  ['హోమ్', 'en', 'Home'],
  ['6 పేజీలు · చదవడానికి నొక్కండి', 'ta', '6 பக்கங்கள் · படிக்கத் தொடவும்'],
  ['శ్రీ కృష్ణ భజన మందిరము, పేరూరు - 517 505', 'kn', 'ಶ್ರೀ ಕೃಷ್ಣ ಭಜನ ಮಂದಿರ, ಪೇರೂರು - 517 505'],
  ['ఆలయ చిత్రం 3', 'en', 'Temple photo 3'],
  ['సుప్రభాతం — పేజీ 2', 'en', 'Suprabhatam — page 2'],
];
for (const [te, lang, want] of ui) {
  const got = convert(te, lang);
  if (got !== want) { bad++; console.log(`FAIL ui ${lang} ${te}: got ${got}, want ${want}`); }
}
console.log(bad ? `${bad} failed` : 'all passed');
if (bad) process.exit(1);
