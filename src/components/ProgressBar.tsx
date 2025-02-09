import React from 'react';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';

interface Props {
  progress: number; // 0 ~ 1
}

const ProgressBar: React.FC<Props> = ({ progress }) => {
  return <PaperProgressBar progress={progress} style={{ height: 6 }} />;
};

export default ProgressBar;
