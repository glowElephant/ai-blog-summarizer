const { summarizeText } = require('./utils');

test('summarizeText returns up to three sentences', () => {
  const content = '첫 번째 문장입니다. 두 번째 문장입니다. 세 번째 문장입니다. 네 번째 문장입니다.';
  const summary = summarizeText(content);
  const sentences = summary.split(/(?<=[.!?])\s+/).filter(Boolean);
  expect(sentences.length).toBeLessThanOrEqual(3);
});
