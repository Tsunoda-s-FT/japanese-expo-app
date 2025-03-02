import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Title, Card } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getAllLessons } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import AppLoading from '../components/ui/AppLoading';
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
  const { translations, language } = useLanguage();
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
      <View style={commonStyles.centeredContent}>
        <Text>{language === 'ja' ? "レッスンが見つかりません。" : "No lessons found."}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.languageCard}>
        <Card.Content style={styles.headerRow}>
          <LanguageSelector />
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('LanguageSettings')}
            accessibilityLabel={language === 'ja' ? "言語設定" : "Language Settings"}
            accessibilityRole="button"
          >
            <Icon name="cog" size={24} color={colors.primary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Title style={styles.header}>
        {language === 'ja' ? 'レッスン一覧' : 'Lessons'}
      </Title>

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
                <View style={styles.metaContainer}>
                  <Icon name="clock-outline" size={14} color="#fff" />
                  <Text style={styles.meta}>{lesson.totalEstimatedTime}</Text>
                  <Icon name="book-outline" size={14} color="#fff" style={styles.metaIcon} />
                  <Text style={styles.meta}>{lesson.courses.length}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  languageCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.text,
    textAlign: 'center',
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
    elevation: 4,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
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
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  metaIcon: {
    marginLeft: 12,
  }
});

export default LessonListScreen;
