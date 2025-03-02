import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface SlideInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
  direction?: SlideDirection;
  distance?: number;
}

/**
 * スライドインアニメーションを行うViewコンポーネント
 */
export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  duration = 300,
  delay = 0,
  direction = 'bottom',
  distance = 100,
  style,
  ...props
}) => {
  const translateX = useRef(new Animated.Value(direction === 'left' ? -distance : direction === 'right' ? distance : 0)).current;
  const translateY = useRef(new Animated.Value(direction === 'top' ? -distance : direction === 'bottom' ? distance : 0)).current;

  useEffect(() => {
    Animated.timing(direction === 'left' || direction === 'right' ? translateX : translateY, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [translateX, translateY, direction, duration, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
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