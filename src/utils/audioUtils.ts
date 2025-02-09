import { Audio } from 'expo-av';

export async function playAudio(audioUri: string) {
  try {
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: audioUri });
    await sound.playAsync();
  } catch (error) {
    console.warn('Failed to play audio:', audioUri, error);
  }
}
