import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type QuizResultRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;
type QuizResultNavProp = NativeStackNavigationProp<RootStackParamList, 'QuizResult'>;

const QuizResultScreen: React.FC = () => {
  const route = useRoute<QuizResultRouteProp>();
  const navigation = useNavigation<QuizResultNavProp>();
  const { correctCount, totalCount } = route.params;

  const scorePercent = ((correctCount / totalCount) * 100).toFixed(0);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.scoreText}>
        {totalCount}問中 {correctCount}問正解！
      </Text>
      <Text variant="titleMedium">正答率: {scorePercent}%</Text>
      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate('Home')}
      >
        ホームに戻る
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreText: {
    marginBottom: 12
  }
});

export default QuizResultScreen;
