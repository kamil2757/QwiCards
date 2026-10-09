import { useContext, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/constants";
import ModalEditWord from "@/components/ModalEditWord";
import { MyContext } from "@/MyContext";

interface OpenTranslationAnimationProps {
  word: string;
  translation: string;
}

export default function OpenTranslationAnimation({
  word,
  translation,
}: OpenTranslationAnimationProps) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const [isFilled, setIsFilled] = useState(false);
  const context = useContext(MyContext);

  if (!context) {
    throw new Error("HomeScreen must be used within a MyContext.Provider");
  }

  const { setModalInfo } = context;

  function toggleAnimation() {
    const saved = isFilled;
    setIsFilled(!isFilled);
    let animation: Animated.CompositeAnimation;

    if (saved) {
      animation = Animated.timing(fillAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      });
    } else {
      animation = Animated.spring(fillAnim, {
        toValue: 1,
        bounciness: 12,
        useNativeDriver: false,
      });
    }

    animation.start();

    return () => {
      animation.stop();
    };
  }

  // function openModalEdit() {
  //   setModalInfo({ word, translation });
  // }

  const animHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
    extrapolateRight: "extend", // Разрешаем отскоки вверх
    extrapolateLeft: "clamp", // Запрещаем отскоки вниз
  });

  return (
    <Pressable onPress={toggleAnimation} style={styles.wordBlock}>
      <View>
        <MyText style={styles.Word}>
          {word.length >= 22 ? word.slice(0, 22) + "..." : word}
        </MyText>
      </View>

      <Animated.View style={[styles.animatedContainer, { height: animHeight }]}>
        <MyText style={styles.Translation}>
          {translation.length >= 22
            ? translation.slice(0, 22) + "..."
            : translation}
        </MyText>
        <MaterialIcons
          name="edit"
          color={Colors.GreyColor}
          size={22}
          style={styles.editIcon}
          onPress={() => setModalInfo({ word, translation })}
        ></MaterialIcons>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wordBlock: {
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Colors.backgroundColor,
    overflow: "hidden",

    marginTop: 8,
    marginEnd: 8,
  },

  animatedContainer: {
    backgroundColor: Colors.accentColor,
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  Word: {
    paddingStart: 20,
  },

  Translation: {
    paddingStart: 20,
  },

  editIcon: {
    paddingEnd: 20,
  },
});
