import JavaScriptObfuscator from 'javascript-obfuscator';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const extraNoise = `
  const hidden1 = '希ﾀLangzEnc鿣';
  const hidden2 = '希ﾀLangzX鿣';
  const hidden3 = '希ﾀLangzSecret鿣';
  `;

  const fullCode = code + '\n' + extraNoise;

  try {
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(fullCode, {
      compact: true,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 1,
      renameGlobals: true,
      identifiersPrefix: '希ﾀLangzEnc鿣',
      identifiersDictionary: [
        '希ﾀLangzEnc鿣', '希ﾀLangzX鿣', '希ﾀLangzSecret鿣',
        'LangzPanel', 'LangzPower', 'LangzObf'
      ],
      stringArray: true,
      stringArrayThreshold: 1,
      splitStrings: true,
      splitStringsChunkLength: 3,
      selfDefending: true,
      unicodeEscapeSequence: true
    }).getObfuscatedCode();

    res.status(200).json({ obfuscatedCode });
  } catch (err) {
    res.status(500).json({ error: 'Obfuscation failed', detail: err.message });
  }
}
