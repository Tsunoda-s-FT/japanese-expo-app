import { Audio, AVPlaybackStatus } from 'expo-av';

// 音声ファイルのマッピング
const audioFiles: { [key: string]: any } = {
  'audio/ohayou_gozaimasu.mp3': require('../../assets/audio/ohayou_gozaimasu.mp3'),
  'audio/ohayou.mp3': require('../../assets/audio/ohayou.mp3'),
  'audio/konnichiwa.mp3': require('../../assets/audio/konnichiwa.mp3'),
  'audio/kyou.mp3': require('../../assets/audio/kyou.mp3'),
  'audio/example_morning_1.mp3': require('../../assets/audio/example_morning_1.mp3')
};

export async function playAudio(audioPath: string): Promise<void> {
  try {
    const sound = new Audio.Sound();
    if (audioPath.startsWith('http')) {
      // URLの場合は直接読み込み
      await sound.loadAsync({ uri: audioPath });
    } else {
      // ローカルファイルの場合はマッピングから取得
      const audioSource = audioFiles[audioPath];
      if (!audioSource) {
        console.warn('Audio file not found:', audioPath);
        return;
      }
      await sound.loadAsync(audioSource);
    }
    await sound.playAsync();
    // 再生が終わったらアンロード
    sound.setOnPlaybackStatusUpdate(async (status: AVPlaybackStatus) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.warn('Failed to play audio:', audioPath, error);
  }
}
