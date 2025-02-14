import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

type AudioButtonProps = {
  onPress: () => void;  // 音声再生処理を外から受け取る
};

const AudioButton: React.FC<AudioButtonProps> = ({ onPress }) => {
  return (
    <Button
      mode="contained"
      icon="play-circle"
      onPress={onPress}
      style={styles.button}
      labelStyle={styles.label}
      accessibilityLabel="音声を再生"
    >
      再生
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
  },
});

export default AudioButton;
