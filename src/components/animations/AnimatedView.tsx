import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

type AnimationType = 'fade' | 'slide' | 'both';
type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface AnimatedViewProps extends ViewProps {
  animation: AnimationType;
  direction?: SlideDirection;
  duration?: number;
  delay?: number;
  initialOpacity?: number;
  finalOpacity?: number;
  distance?: number;
}

/**
 * アニメーション効果を提供する汎用Viewコンポーネント
 * フェードイン、スライドイン、または両方を組み合わせたアニメーションをサポート
 */
export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = 'fade',
  direction = 'bottom',
  duration = 300,
  delay = 0,
  initialOpacity = 0,
  finalOpacity = 1,
  distance = 100,
  style,
  ...props
}) => {
  // アニメーションに使用する値
  const opacity = useRef(new Animated.Value(animation === 'slide' ? 1 : initialOpacity)).current;
  const translateX = useRef(
    new Animated.Value(
      (animation === 'slide' || animation === 'both') && (direction === 'left' || direction === 'right')
        ? direction === 'left'
          ? -distance
          : distance
        : 0
    )
  ).current;
  const translateY = useRef(
    new Animated.Value(
      (animation === 'slide' || animation === 'both') && (direction === 'top' || direction === 'bottom')
        ? direction === 'top'
          ? -distance
          : distance
        : 0
    )
  ).current;

  useEffect(() => {
    const animations = [];

    // フェードアニメーション
    if (animation === 'fade' || animation === 'both') {
      animations.push(
        Animated.timing(opacity, {
          toValue: finalOpacity,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // スライドアニメーション
    if (animation === 'slide' || animation === 'both') {
      const translateAnim = direction === 'left' || direction === 'right' ? translateX : translateY;
      animations.push(
        Animated.timing(translateAnim, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // 複数のアニメーションを並行して実行
    Animated.parallel(animations).start();
  }, [animation, opacity, translateX, translateY, finalOpacity, duration, delay, direction]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: animation === 'slide' ? 1 : opacity,
          transform: [
            { translateX },
            { translateY },
          ],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}; 