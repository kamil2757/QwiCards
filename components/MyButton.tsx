import {
  ButtonProps,
  Pressable,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import MyText from "@/components/MyText";
import { Colors, FontSizes } from "@/constants/constants";

interface MyButtonProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  version?: "v1" | "v2";
  onPress?: () => void;
}

export default function MyButton({
  children,
  style,
  onPress,
  version = "v1",
  ...rest
}: MyButtonProps) {
  if (version == "v1") {
    return (
      <Pressable
        {...rest}
        style={({ pressed }) => [
          styles.buttonV1,
          style,
          pressed && {backgroundColor: Colors.accentColorDark},
        ]}
        onPress={() => {
          onPress ? onPress() : null;
        }}
      >
        <MyText>{children}</MyText>
      </Pressable>
    );
  }

  if (version == "v2") {
    return (
      <Pressable
        {...rest}
        style={({ pressed }) => [
          styles.buttonV2,
          style,
          pressed && {backgroundColor: Colors.accentColor},
        ]}
        onPress={() => {
          onPress ? onPress() : null;
        }}
      >
        <MyText>{children}</MyText>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  buttonV1: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: Colors.accentColor,
  },

  buttonV2: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,

    backgroundColor: "transparent",
    borderColor: Colors.accentColor,
    borderWidth: 2,
  }
});
