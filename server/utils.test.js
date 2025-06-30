const { summarizeText } = require('./utils');

describe('summarizeText', () => {
  test('returns up to three sentences', () => {
    const content = '첫 번째 문장입니다. 두 번째 문장입니다. 세 번째 문장입니다. 네 번째 문장입니다.';
    const summary = summarizeText(content);
    const sentences = summary.split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences.length).toBeLessThanOrEqual(3);
  });

  test('returns the first three sentences intact', () => {
    const sentences = ['A.', 'B.', 'C.', 'D.'];
    const content = sentences.join(' ');
    expect(summarizeText(content)).toBe(sentences.slice(0, 3).join(' '));
  });

  test('handles newlines properly', () => {
    const content = '문장 하나.\n문장 둘.\n문장 셋.\n문장 넷.';
    const expected = '문장 하나. 문장 둘. 문장 셋.';
    expect(summarizeText(content)).toBe(expected);
  });
});
