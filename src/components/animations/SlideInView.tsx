import React, { useEffect } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface SlideInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  direction?: SlideDirection;
  distance?: number;
}

/**
 * スライドインアニメーションを適用するコンポーネント
 * 子要素を指定した方向からスライドさせるアニメーションを提供します
 */
const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  style,
  duration = 500,
  delay = 0,
  direction = 'bottom',
  distance = 100,
}) => {
  // 位置のアニメーション値
  const translateValue = new Animated.Value(distance);

  useEffect(() => {
    // コンポーネントがマウントされたらアニメーションを開始
    Animated.timing(translateValue, {
      toValue: 0,
      duration: duration,
      delay: delay,
      useNativeDriver: true, // ネイティブドライバーを使用して最適化
    }).start();
  }, []);

  // 方向に応じたスタイルを生成
  const getAnimatedStyle = () => {
    switch (direction) {
      case 'left':
        return { transform: [{ translateX: translateValue }] };
      case 'right':
        return { transform: [{ translateX: translateValue.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance]
        }) }] };
      case 'top':
        return { transform: [{ translateY: translateValue }] };
      case 'bottom':
      default:
        return { transform: [{ translateY: translateValue.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance]
        }) }] };
    }
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
};

export default SlideInView; 