import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

interface FadeInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
  initialOpacity?: number;
  finalOpacity?: number;
}

/**
 * フェードインアニメーションを行うViewコンポーネント
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  duration = 300,
  delay = 0,
  initialOpacity = 0,
  finalOpacity = 1,
  style,
  ...props
}) => {
  const opacity = useRef(new Animated.Value(initialOpacity)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: finalOpacity,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [opacity, finalOpacity, duration, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}; 