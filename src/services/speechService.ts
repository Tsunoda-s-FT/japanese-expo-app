export async function recordAndEvaluatePhrase(phraseId: string): Promise<{
  score: number;
  feedback: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const score = Math.floor(Math.random() * 40) + 60; // 60~99
  let feedback = 'もう少し練習が必要です。';
  if (score >= 90) {
    feedback = '素晴らしい発音です！';
  } else if (score >= 80) {
    feedback = 'ほぼ完璧です。';
  }

  return { score, feedback };
}
