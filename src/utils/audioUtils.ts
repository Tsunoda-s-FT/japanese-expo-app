import { Audio, AVPlaybackStatus } from 'expo-av';

// 音声ファイルのマッピング
const audioFiles: { [key: string]: any } = {
  'audio/ohayou_gozaimasu.mp3': require('../../assets/audio/ohayou_gozaimasu.mp3'),
  'audio/ohayou.mp3': require('../../assets/audio/ohayou.mp3'),
  'audio/ohayou_business.mp3': require('../../assets/audio/ohayou_business.mp3'),
  'audio/gozaimasu.mp3': require('../../assets/audio/gozaimasu.mp3'),
  'audio/konnichiwa.mp3': require('../../assets/audio/konnichiwa.mp3'),
  'audio/desu.mp3': require('../../assets/audio/desu.mp3'),
  'audio/kyou.mp3': require('../../assets/audio/kyou.mp3'),
  'audio/watashi.mp3': require('../../assets/audio/watashi.mp3'),
  'audio/watashi_wa_tanaka.mp3': require('../../assets/audio/watashi_wa_tanaka.mp3'),
  'audio/yoroshiku.mp3': require('../../assets/audio/yoroshiku.mp3'),
  'audio/onegai_itashimasu.mp3': require('../../assets/audio/onegai_itashimasu.mp3'),
  'audio/example_morning_1.mp3': require('../../assets/audio/example_morning_1.mp3'),
  'audio/example_konnichiwa_1.mp3': require('../../assets/audio/example_konnichiwa_1.mp3'),
  'audio/example_business_1.mp3': require('../../assets/audio/example_business_1.mp3'),
  'audio/example_intro_1.mp3': require('../../assets/audio/example_intro_1.mp3')
};

// 音声を再生する関数
export async function playAudio(audioPath: string): Promise<void> {
  try {
    if (!audioPath) {
      console.warn('No audio path provided');
      return;
    }

    const audioFile = audioFiles[audioPath];
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
