import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useThemeContext } from '../context/ThemeContext';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'body' 
  | 'bodyBold'
  | 'caption' 
  | 'label'
  | 'small';

type TextColor = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'inverse'
  | 'error'
  | 'success';

export interface ThemedTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}) => {
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];

  const variantStyles = {
    h1: {
      fontSize: 32,
      fontFamily: theme.fonts.headingBold,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontFamily: theme.fonts.headingBold,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      lineHeight: 20,
    },
    label: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      fontFamily: theme.fonts.regular,
      lineHeight: 16,
    },
  };

  const colorStyles = {
    primary: { color: theme.text.primary },
    secondary: { color: theme.text.secondary },
    tertiary: { color: theme.text.tertiary },
    inverse: { color: theme.text.inverse },
    error: { color: '#EF4444' },
    success: { color: '#10B981' },
  };

  return (
    <RNText
      style={[
        variantStyles[variant],
        colorStyles[color],
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

// Convenience components for common use cases
export const H1: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h1" {...props} />
);

export const H2: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h2" {...props} />
);

export const H3: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h3" {...props} />
);

export const Body: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="body" {...props} />
);

export const BodyBold: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="bodyBold" {...props} />
);

export const Caption: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="caption" {...props} />
);

export const Label: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="label" {...props} />
);

export const Small: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="small" {...props} />
);
