import React from 'react';
import { Button } from 'react-native-paper';

interface QuizOptionProps {
  label: string;
  onPress: () => void;
  selected: boolean;
  disabled: boolean;
}

const QuizOption: React.FC<QuizOptionProps> = ({ label, onPress, selected, disabled }) => {
  return (
    <Button
      mode={selected ? 'contained' : 'outlined'}
      onPress={onPress}
      disabled={disabled}
      style={{ marginVertical: 4 }}
    >
      {label}
    </Button>
  );
};

export default QuizOption; 