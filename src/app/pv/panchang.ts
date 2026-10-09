// Daily panchang for the sankalpam, computed from Sun/Moon positions (Meeus low-precision + Lahiri ayanamsa).
// ponytail: ~0.05° accuracy, so near a tithi/nakshatra boundary the answer can be off by under an hour; swap in astronomy-engine if that matters.
// ponytail: evaluated at 6:00 local time, not true sunrise; adhika masa is not detected.

const SAMVATSARA = ['ప్రభవ', 'విభవ', 'శుక్ల', 'ప్రమోదూత', 'ప్రజోత్పత్తి', 'ఆంగీరస', 'శ్రీముఖ', 'భావ', 'యువ', 'ధాత',
  'ఈశ్వర', 'బహుధాన్య', 'ప్రమాది', 'విక్రమ', 'వృష', 'చిత్రభాను', 'స్వభాను', 'తారణ', 'పార్థివ', 'వ్యయ',
  'సర్వజిత్', 'సర్వధారి', 'విరోధి', 'వికృతి', 'ఖర', 'నందన', 'విజయ', 'జయ', 'మన్మథ', 'దుర్ముఖి',
  'హేవిళంబి', 'విళంబి', 'వికారి', 'శార్వరి', 'ప్లవ', 'శుభకృత్', 'శోభకృత్', 'క్రోధి', 'విశ్వావసు', 'పరాభవ',
  'ప్లవంగ', 'కీలక', 'సౌమ్య', 'సాధారణ', 'విరోధికృత్', 'పరీధావి', 'ప్రమాదీచ', 'ఆనంద', 'రాక్షస', 'నల',
  'పింగళ', 'కాళయుక్తి', 'సిద్ధార్థి', 'రౌద్రి', 'దుర్మతి', 'దుందుభి', 'రుధిరోద్గారి', 'రక్తాక్షి', 'క్రోధన', 'అక్షయ'];
const MASA = ['చైత్ర', 'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ', 'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ'];
const RITU = ['వసంత', 'గ్రీష్మ', 'వర్ష', 'శరద్', 'హేమంత', 'శిశిర'];
const TITHI = ['పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి',
  'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పౌర్ణమి', 'అమావాస్య'];
const VARA = ['భాను', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];
const NAKSHATRA = ['అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆర్ద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష',
  'మఖ', 'పూర్వఫల్గుణి', 'ఉత్తరఫల్గుణి', 'హస్త', 'చిత్ర', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ',
  'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణ', 'ధనిష్ఠ', 'శతభిష', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'];

const rad = Math.PI / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;
const T = (d: Date) => (d.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;

function sun(t: number) {
  const M = 357.5291092 + 35999.0502909 * t;
  const C = (1.914602 - 0.004817 * t) * Math.sin(M * rad) + 0.019993 * Math.sin(2 * M * rad) + 0.000289 * Math.sin(3 * M * rad);
  return norm(280.46646 + 36000.76983 * t + C);
}

function moon(t: number) {
  const D = 297.8501921 + 445267.1114034 * t, M = 357.5291092 + 35999.0502909 * t;
  const m = 134.9633964 + 477198.8675055 * t, F = 93.2720950 + 483202.0175233 * t;
  const terms: [number, number, number, number, number][] = [ // [coef 1e-6°, D, M, M', F]
    [6288774, 0, 0, 1, 0], [1274027, 2, 0, -1, 0], [658314, 2, 0, 0, 0], [213618, 0, 0, 2, 0],
    [-185116, 0, 1, 0, 0], [-114332, 0, 0, 0, 2], [58793, 2, 0, -2, 0], [57066, 2, -1, -1, 0],
    [53322, 2, 0, 1, 0], [45758, 2, -1, 0, 0], [-40923, 0, 1, -1, 0], [-34720, 1, 0, 0, 0],
    [-30383, 0, 1, 1, 0], [15327, 2, 0, 0, -2], [-12528, 0, 0, 1, 2], [10980, 0, 0, 1, -2],
    [10675, 4, 0, -1, 0], [10034, 0, 0, 3, 0], [8548, 4, 0, -2, 0], [-7888, 2, 1, -1, 0],
    [-6766, 2, 1, 0, 0], [-5163, 1, 0, -1, 0]];
  const sum = terms.reduce((s, [c, d, ms, mm, f]) => s + c * Math.sin((d * D + ms * M + mm * m + f * F) * rad), 0);
  return norm(218.3164477 + 481267.88123421 * t + sum / 1e6);
}

const ayanamsa = (t: number) => 23.853 + 1.3969 * t; // Lahiri
const elong = (t: number) => norm(moon(t) - sun(t));

export function panchang(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6);
  const t = T(d);
  const sunSid = norm(sun(t) - ayanamsa(t)), moonSid = norm(moon(t) - ayanamsa(t));
  const tithi = Math.floor(elong(t) / 12); // 0..29

  // Amanta masa: named after the rashi the Sun is in at the preceding new moon.
  let nm = t - elong(t) / 12.19 / 36525;
  for (let i = 0; i < 3; i++) nm -= ((elong(nm) + 180) % 360 - 180) / 12.19 / 36525;
  const masa = (Math.floor(norm(sun(nm) - ayanamsa(nm)) / 30) + 1) % 12;

  // Year turns at Ugadi (Chaitra shukla pratipada); Pausha/Magha/Phalguna early in the calendar year belong to last year.
  const year = d.getFullYear() - (masa >= 9 && d.getMonth() < 6 ? 1 : 0);

  return {
    samvatsara: SAMVATSARA[((year - 1987) % 60 + 60) % 60],
    ayana: sunSid >= 270 || sunSid < 90 ? 'ఉత్తర' : 'దక్షిణ',
    ritu: RITU[Math.floor(masa / 2)],
    masa: MASA[masa],
    paksha: tithi < 15 ? 'శుక్ల' : 'కృష్ణ',
    tithi: tithi === 29 ? TITHI[15] : TITHI[tithi % 15],
    vara: VARA[d.getDay()],
    nakshatra: NAKSHATRA[Math.floor(moonSid / (360 / 27))],
  };
}
