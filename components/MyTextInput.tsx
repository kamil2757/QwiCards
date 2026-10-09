import { TextInputProps, TextInput, StyleSheet } from "react-native";
import { Colors, FontSizes } from "@/constants/constants";

export default function MyTextInput({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      {...rest}
      style={[styles.input, style]}
      placeholderTextColor={Colors.GreyWhiteColor}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 12,
    paddingStart: 16,
    paddingEnd: 16,
    color: "white",

    justifyContent: "center",

    fontSize: FontSizes.BodyFSize,
  },
});
