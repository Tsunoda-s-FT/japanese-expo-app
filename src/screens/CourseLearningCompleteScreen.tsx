import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionStackParamList } from '../navigation/SessionNavigator';

type CourseLearningCompleteRouteProp = RouteProp<SessionStackParamList, 'CourseLearningComplete'>;
type SessionNavProp = NativeStackNavigationProp<SessionStackParamList, 'CourseLearningComplete'>;

export default function CourseLearningCompleteScreen() {
  const navigation = useNavigation<SessionNavProp>();
  const route = useRoute<CourseLearningCompleteRouteProp>();
  const { courseId } = route.params;

  const handleGoToQuiz = () => {
    navigation.navigate('CourseQuiz', { courseId });
  };

  const handleExitSession = () => {
    navigation.getParent()?.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>学習完了</Title>
          <Text style={styles.message}>お疲れさまです。学習が完了しました。</Text>
          <Text style={styles.message}>次のステップを選んでください。</Text>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleGoToQuiz}
            style={styles.button}
          >
            クイズを受ける
          </Button>
          <Button
            mode="outlined"
            onPress={handleExitSession}
            style={styles.button}
          >
            終了する
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    marginBottom: 8,
    textAlign: 'center',
  },
  actions: {
    marginTop: 24,
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
  },
  button: {
    marginVertical: 8,
  },
});
