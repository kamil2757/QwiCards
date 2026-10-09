import { Colors, FontSizes } from '@/constants/constants';
import { StyleSheet, Text, TextProps,  TextStyle, StyleProp } from "react-native";

interface MyTextProps extends TextProps {
    children: React.ReactNode
    style?: StyleProp<TextStyle>
}

export default function MyText({children, style, ...rest}: MyTextProps){
    return(
        <Text {...rest} style={[styles.text, style]}>{children}</Text>
    )
}

const styles = StyleSheet.create({
  text: {
    color: Colors.textColor,
    fontSize: FontSizes.BodyFSize
  }
});