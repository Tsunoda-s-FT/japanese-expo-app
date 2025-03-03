import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getAllLessons } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import { AppLoading, AppHeader } from '../components';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { commonStyles } from '../theme/styles';

// 画像のマッピング
const lessonImages: { [key: string]: any } = {
  'ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
  // 他の画像もここに追加
};

// 画像のパスから画像ソースを取得する関数
const getImageSource = (path: string) => {
  // パスからファイル名を抽出
  const fileName = path.split('/').pop();
  if (fileName && lessonImages[fileName]) {
    return lessonImages[fileName];
  }
  // 該当する画像が見つからない場合はデフォルト画像を返すか、nullを返す
  return null;
};

type LessonListNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LessonList'>;

const LessonListScreen: React.FC = () => {
  const navigation = useNavigation<LessonListNavigationProp>();
  const { language, t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllLessons();
        setLessons(data);
      } catch (error) {
        console.error('Error loading lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('LessonDetail', { lessonId });
  };

  if (loading) {
    return <AppLoading message={language === 'ja' ? "レッスンを読み込み中..." : "Loading lessons..."} />;
  }

  if (!lessons || lessons.length === 0) {
    return (
      <View style={[commonStyles.centeredContent, styles.container]}>
        <AppHeader title={language === 'ja' ? "レッスンが見つかりません" : "No Lessons"} />
        <Text>{language === 'ja' ? "レッスンが見つかりません。" : "No lessons found."}</Text>
      </View>
    );
  }

  const screenTitle = language === 'ja' ? 'レッスン' : 'Lessons';

  return (
    <View style={styles.container}>
      <AppHeader title={screenTitle} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.lessonGrid}>
          {lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => handleLessonPress(lesson.id)}
              style={styles.lessonCard}
              activeOpacity={0.7}
            >
              {lesson.thumbnail && (
                <Image
                  source={getImageSource(lesson.thumbnail) || { uri: 'https://placehold.co/600x400/png' }}
                  style={styles.thumbnail}
                />
              )}
              <View style={styles.cardOverlay}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{lesson.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {lesson.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingTop: spacing.md,
  },
  lessonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  lessonCard: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
    opacity: 0.9,
  },
});

export default LessonListScreen;
