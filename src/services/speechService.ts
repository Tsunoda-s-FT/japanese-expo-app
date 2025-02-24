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

export interface PronunciationEvaluationResult {
  accuracyScore: number;      // 精度スコア
  fluencyScore: number;       // 流暢性スコア
  completenessScore: number;  // 完全性スコア
  prosodyScore: number;       // 韻律スコア(オプション)
  pronScore: number;          // 最終的な総合スコア

  // エラー統計 (誤った発音・省略・挿入など)
  mispronunciationCount: number;
  omissionCount: number;
  insertionCount: number;

  feedback: string;  // 一言フィードバック
}

/** 
 * Azure発音評価APIを想定したモック実装。 
 *  - 実際には録音結果のバイナリなどを送るが、ここではランダムな評価を返すだけ。
 */
export async function evaluatePronunciationMock(
  phraseId: string,
  audioData: any
): Promise<PronunciationEvaluationResult> {
  // 擬似的なAPI呼び出しディレイ
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // ランダムに 60～100 程度のスコアを生成
  const rnd = () => Math.floor( Math.random() * 41 ) + 60; 
  const accuracy = rnd();
  const fluency = rnd();
  const completeness = rnd();
  const prosody = rnd();

  // pronScore は4つの平均にしてみる
  const overall = Math.round((accuracy + fluency + completeness + prosody) / 4);

  // 誤った発音・省略・挿入なども雑にモック
  const mis = Math.floor(Math.random() * 5); 
  const omi = Math.floor(Math.random() * 3);
  const ins = Math.floor(Math.random() * 2);

  // 一言フィードバックの候補をいくつか設定
  const feedbackList = [
    '素晴らしい発音です！',
    'この調子でもっと練習しましょう！',
    '少しぎこちないかもしれません。もう少し頑張って！',
    'とても上手ですね！',
    '発音は良いですが、リズムに注意してみましょう。',
    'アクセントを意識するとさらに良くなります。',
  ];
  const randomIndex = Math.floor(Math.random() * feedbackList.length);
  const feedback = feedbackList[randomIndex];

  return {
    accuracyScore: accuracy,
    fluencyScore: fluency,
    completenessScore: completeness,
    prosodyScore: prosody,
    pronScore: overall,
    mispronunciationCount: mis,
    omissionCount: omi,
    insertionCount: ins,
    feedback,
  };
}
