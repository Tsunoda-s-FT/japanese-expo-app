import { Audio, AVPlaybackStatus } from 'expo-av';
import { audioFiles, defaultAudios } from './audioMapping';

// プレースホルダー音声の参照
const PLACEHOLDER_AUDIO = audioFiles['audio/placeholder.mp3'];

// 音声を再生する関数
export async function playAudio(audioPath: string): Promise<void> {
  try {
    if (!audioPath) {
      console.warn('No audio path provided');
      return;
    }

    // 適切なオーディオファイルを取得
    const audioFile = getAudioResource(audioPath);
    
    if (!audioFile) {
      console.warn(`Audio file not found: ${audioPath}`);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(audioFile);
    await sound.playAsync();

    // 音声の再生が終了したら自動的にアンロード
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(error => {
          console.error('Error unloading sound:', error);
        });
      }
    });
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}

// アプリ終了時やコンポーネントのアンマウント時に呼び出す
export async function cleanupAudio(): Promise<void> {
  try {
    await Audio.setIsEnabledAsync(false);
  } catch (error) {
    console.error('Error cleaning up audio:', error);
  }
}

// 音声リソースを取得する関数
export function getAudioResource(path: string): any {
  if (!path) {
    console.warn('No audio path provided');
    return null;
  }
  
  try {
    // 1. まず、マッピングされた実際の音声があるか確認
    const audioSource = audioFiles[path];
    if (audioSource) {
      return audioSource;
    }
    
    // 2. 次に、defaultAudiosにマッピングがあるか確認
    // (空ファイルやまだ実装されていないファイル用)
    const defaultAudio = defaultAudios[path];
    if (defaultAudio) {
      console.log(`Using placeholder audio for: ${path}`);
      return defaultAudio;
    }
    
    // 3. どちらのマッピングにもない場合はnullを返す
    console.warn(`Audio file not found in any mapping: ${path}`);
    return null;
  } catch (error) {
    // 音声ロード中のエラーをキャッチし、アプリがクラッシュしないようにする
    console.warn(`Error loading audio: ${path}`, error);
    return null;
  }
}

// 発音評価関連の型定義
export interface PronunciationEvaluationResult {
  accuracyScore: number;      // 精度スコア
  fluencyScore: number;       // 流暢性スコア
  completenessScore: number;  // 完全性スコア
  prosodyScore: number;       // 韻律スコア(オプション)
  pronScore: number;          // 最終的な総合スコア

  // エラー統計 (誤った発音・省略・挿入など)
  mispronunciationCount: number;
  omissionCount?: number;
  insertionCount?: number;

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