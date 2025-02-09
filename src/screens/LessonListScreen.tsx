import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, useTheme, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getContent } from '../services/contentService';
import { Lesson } from '../types/contentTypes';

type RootStackParamList = {
  LessonDetail: { lessonId: string };
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params: any) => void;
};

export default function LessonListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const content = getContent();

  console.log('Available lessons:', content.lessons);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>日本語学習</Title>
        <Paragraph style={styles.subtitle}>
          レッスンを選んで学習を始めましょう
        </Paragraph>
      </View>
      {content.lessons.map((lesson: Lesson) => {
        console.log('Rendering lesson:', lesson.id, lesson.title);
        return (
          <Card
            key={lesson.id}
            style={styles.card}
            onPress={() => {
              console.log('Navigating to lesson:', lesson.id);
              navigation.navigate('LessonDetail', { lessonId: lesson.id });
            }}
          >
            <Card.Content>
              <Title style={styles.cardTitle}>{lesson.title}</Title>
              <Paragraph>{lesson.description}</Paragraph>
              <View style={styles.lessonInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>コース数</Text>
                  <Text style={styles.infoValue}>{lesson.courses.length}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>所要時間</Text>
                  <Text style={styles.infoValue}>{lesson.totalEstimatedTime}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>カテゴリー</Text>
                  <Text style={styles.infoValue}>{lesson.category}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    margin: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lessonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
