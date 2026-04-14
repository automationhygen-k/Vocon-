import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const KEIKO = {
  start: [
    'Alright... let’s see what you actually know today.',
    'Don’t just tap through this. Try to mean what you say.'
  ],
  avoidance: [
    'You’ve skipped this twice already… coincidence?',
    'This one again? You’re dodging it.'
  ],
  firstAttempt: [
    'Not clean… but you tried. Keep going.',
    'Messy. Good. That means you are learning.'
  ],
  improvement: [
    'Wait… that was smoother.',
    'You didn’t hesitate this time.'
  ],
  correction: [
    'That works… but no one really says it like that.',
    'Grammatically fine. Socially weird. Try this instead.'
  ],
  breakthrough: [
    'Say it properly… you just handled that.',
    'You avoided this earlier. Now look at you.'
  ],
  end: [
    'That was better than when you started. Don’t ignore that.',
    'You’re improving. Slowly… but it’s real.'
  ]
};

const SUPPORTED_LANGUAGES = {
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    scripts: [/[ぁ-んァ-ン一-龯]/],
    scenarios: {
      shop: {
        npcIntro: '店員: いらっしゃいませ。今日は何をお探しですか？',
        better: 'りんごと米と牛乳をください。全部でいくらですか？',
        hints: ['ください', 'いくら', '全部']
      },
      cafe: {
        npcIntro: '店員: ご注文は何になさいますか？',
        better: 'ラテを一つお願いします。今日は忙しいですか？',
        hints: ['お願いします', 'ください', 'ですか']
      },
      directions: {
        npcIntro: '地元の人: どこへ行きたいですか？',
        better: 'すみません、駅はどこですか？歩いたほうが早いですか？',
        hints: ['すみません', 'どこ', 'ですか']
      },
      library: {
        npcIntro: '司書: こんにちは。何かお探しですか？',
        better: 'この本を借りてもいいですか？返却日はいつですか？',
        hints: ['借り', '返却', 'いつ']
      },
      friend: {
        npcIntro: '友達: 週末、何か予定ある？',
        better: '週末ひま？一緒にコーヒーでもどう？',
        hints: ['週末', '一緒', 'どう']
      }
    }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    scripts: [/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/],
    scenarios: {
      shop: {
        npcIntro: 'Dependiente: ¡Hola! ¿Qué buscas hoy?',
        better: 'Quiero manzanas, arroz y leche. ¿Cuánto es en total?',
        hints: ['quiero', 'cuánto', 'total']
      },
      cafe: {
        npcIntro: 'Barista: Hola, ¿qué te preparo?',
        better: '¿Me pones un latte, por favor? ¿Mucho trabajo hoy?',
        hints: ['por favor', 'me pones', 'hoy']
      },
      directions: {
        npcIntro: 'Local: Claro, ¿a dónde quieres ir?',
        better: 'Perdona, ¿dónde está la estación? ¿Es mejor ir caminando o en bus?',
        hints: ['dónde', 'estación', 'mejor']
      },
      library: {
        npcIntro: 'Bibliotecaria: Hola, ¿te puedo ayudar?',
        better: 'Quiero llevarme este libro. ¿Cuándo tengo que devolverlo?',
        hints: ['libro', 'cuándo', 'devolver']
      },
      friend: {
        npcIntro: 'Amigo: ¡Ey! ¿Planes para el finde?',
        better: '¿Estás libre este fin de semana? ¿Tomamos un café?',
        hints: ['fin de semana', 'libre', 'café']
      }
    }
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    scripts: [/[\u0400-\u04FF]/],
    scenarios: {
      shop: {
        npcIntro: 'Продавец: Здравствуйте! Что вы ищете сегодня?',
        better: 'Можно яблоки, рис и молоко? Сколько это стоит всего?',
        hints: ['можно', 'сколько', 'всего']
      },
      cafe: {
        npcIntro: 'Бариста: Добрый день! Что будете заказывать?',
        better: 'Мне, пожалуйста, латте. У вас сегодня много людей?',
        hints: ['пожалуйста', 'мне', 'сегодня']
      },
      directions: {
        npcIntro: 'Прохожий: Конечно, куда вам нужно?',
        better: 'Извините, где находится станция? Быстрее пешком или на автобусе?',
        hints: ['где', 'станция', 'быстрее']
      },
      library: {
        npcIntro: 'Библиотекарь: Здравствуйте, чем помочь?',
        better: 'Можно взять эту книгу? Когда её нужно вернуть?',
        hints: ['книгу', 'когда', 'вернуть']
      },
      friend: {
        npcIntro: 'Друг: Привет! Какие планы на выходные?',
        better: 'Ты свободен в выходные? Давай выпьем кофе и прогуляемся.',
        hints: ['выходные', 'свободен', 'давай']
      }
    }
  }
};

const baseScenarios = [
  { id: 'shop-1', scenario: 'shop', title: 'Shop: buy groceries', prompt: 'Buy 3 items and ask for the total price.', weakAreaTag: 'numbers' },
  { id: 'cafe-1', scenario: 'cafe', title: 'Café: order and small talk', prompt: 'Order a drink and ask one small-talk question.', weakAreaTag: 'polite_requests' },
  { id: 'directions-1', scenario: 'directions', title: 'Directions: find a station', prompt: 'Ask for a location and add one follow-up question.', weakAreaTag: 'follow_ups' },
  { id: 'library-1', scenario: 'library', title: 'Library: borrow a book', prompt: 'Ask to borrow a book and ask the return policy.', weakAreaTag: 'timing_phrases' },
  { id: 'friend-1', scenario: 'friend', title: 'Friend chat: weekend plans', prompt: 'Talk casually and suggest one activity together.', weakAreaTag: 'casual_flow' }
];

const state = {
  skippedTasks: {},
  attempts: {},
  errors: {},
  hesitationSamples: [],
  effortStreak: 0,
  hiddenProgressScore: 12,
  weakAreaAttempts: 0
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getLanguage = (code) => SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES.ja;

function buildTasks(langCode) {
  const lang = getLanguage(langCode);
  return baseScenarios.map((scenario) => ({
    ...scenario,
    language: lang.code,
    languageName: lang.name,
    npcIntro: lang.scenarios[scenario.scenario].npcIntro
  }));
}

function classify(userText, language, scenarioKey) {
  const text = userText.trim();
  const normalized = text.toLowerCase();
  const tokenCount = text.split(/\s+/).filter(Boolean).length;
  const hintHits = language.scenarios[scenarioKey].hints.filter((hint) => normalized.includes(hint.toLowerCase())).length;
  const scriptMatch = language.scripts.some((rule) => rule.test(text));

  return {
    correctness: hintHits >= 1 && tokenCount >= 4 ? 'correct' : hintHits === 0 ? 'partial' : 'almost',
    naturalness: hintHits >= 2 ? 'natural' : 'unnatural',
    clarity: text.length >= 12 ? 'clear' : 'unclear',
    scriptMatch
  };
}

function toneVariant(base, tone) {
  if (tone === 'confident') return `Confident version: ${base}`;
  if (tone === 'friendly') return `Friendly version: ${base}`;
  return `Neutral version: ${base}`;
}

app.get('/tasks', (req, res) => {
  const duration = Number(req.query.duration || 15);
  const languageCode = String(req.query.language || 'ja');
  const language = getLanguage(languageCode);
  const taskPool = buildTasks(language.code);

  const mandatory = taskPool.slice(0, 3).map((task) => ({ ...task, type: 'mandatory' }));
  const optional = taskPool.slice(3, 5).map((task) => ({ ...task, type: 'optional' }));

  res.json({
    duration,
    language: { code: language.code, name: language.name, nativeName: language.nativeName },
    supportedLanguages: Object.values(SUPPORTED_LANGUAGES).map((lang) => ({ code: lang.code, name: lang.name, nativeName: lang.nativeName })),
    tasks: duration >= 30 ? [...mandatory, ...optional] : [...mandatory, optional[0]],
    keiko: { start: pick(KEIKO.start) }
  });
});

app.post('/evaluate', (req, res) => {
  const { taskId, userText = '', tone = 'neutral', responseTimeMs = 0, language = 'ja' } = req.body;
  const languageMeta = getLanguage(language);
  const scenarioKey = String(taskId || '').split('-')[0] || 'shop';
  const result = classify(userText, languageMeta, scenarioKey);

  const statKey = `${languageMeta.code}:${taskId}`;
  state.attempts[statKey] = (state.attempts[statKey] || 0) + 1;

  if (result.correctness !== 'correct' || result.naturalness === 'unnatural' || !result.scriptMatch) {
    state.errors[statKey] = (state.errors[statKey] || 0) + 1;
  }

  if (responseTimeMs > 5000) state.hesitationSamples.push(responseTimeMs);
  if (state.attempts[statKey] === 1) {
    state.effortStreak += 1;
    state.weakAreaAttempts += 1;
  }

  const targetPhrase = languageMeta.scenarios[scenarioKey].better;
  const correction = !result.scriptMatch
    ? `You are still typing mostly in English. Switch to ${languageMeta.name} words.`
    : result.naturalness === 'natural'
      ? 'Correct and understandable.'
      : pick(KEIKO.correction);

  let keikoMoment;
  if (state.attempts[statKey] === 1) {
    keikoMoment = pick(KEIKO.firstAttempt);
  } else if (result.naturalness === 'natural' && result.correctness === 'correct' && result.scriptMatch) {
    keikoMoment = pick(KEIKO.improvement);
    state.hiddenProgressScore += 4;
  }
  if ((state.errors[statKey] || 0) <= 1 && state.attempts[statKey] >= 2) {
    keikoMoment = pick(KEIKO.breakthrough);
    state.hiddenProgressScore += 5;
  }

  const npcReply = result.correctness === 'correct' && result.scriptMatch
    ? 'Nice. That sounds closer to how locals speak.'
    : `I get your meaning, but tighten it in ${languageMeta.name} and try again.`;

  res.json({
    npcReply,
    feedback: {
      correction,
      betterAlternative: targetPhrase,
      toneVariation: toneVariant(targetPhrase, tone),
      analysis: result,
      language: languageMeta.name
    },
    keikoMoment,
    shouldIncreaseDifficulty: state.hiddenProgressScore > 25 || state.hesitationSamples.length > 3
  });
});

app.get('/progress', (req, res) => {
  const languageCode = String(req.query.language || 'ja');
  const language = getLanguage(languageCode);
  const hiddenReveal = `You improved your ${language.name} real conversation skill by ${Math.min(94, state.hiddenProgressScore + 20)}%.`;

  res.json({
    effortStreak: state.effortStreak,
    weakAreaAttempts: state.weakAreaAttempts,
    skippedTasks: Object.values(state.skippedTasks).reduce((sum, value) => sum + value, 0),
    hiddenReveal,
    keikoEnd: pick(KEIKO.end),
    language: { code: language.code, name: language.name }
  });
});

app.get('/health', (_req, res) => res.json({ ok: true, service: 'vocon-backend' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Vocon backend listening on ${port}`);
});
