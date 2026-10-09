import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import { Colors, FontSizes } from "@/constants/constants";

interface CardAnimationProps {
  word: string;
  translation: string;
  doAnimation: boolean;
  setDoAnimation: (bool: boolean) => void;
}

export default function CardAnimation({
  word,
  translation,
  doAnimation,
  setDoAnimation,
}: CardAnimationProps) {
  const rotationAnimation = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<string>("Загрузка");

  useEffect(() => {

    if (doAnimation && isFlipped) {
      toggleAnimation();
    }

    setTimeout(() => {
      setShowTranslation(translation);
    }, 300);

    setDoAnimation(false);
  }, [doAnimation]);

  function toggleAnimation() {
    const savedFlipped = isFlipped;
    setIsFlipped(!isFlipped);

    Animated.timing(rotationAnimation, {
      toValue: savedFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  const animFront = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animBack = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <Pressable onPress={toggleAnimation} style={styles.blockTest}>
      <Animated.View
        style={[styles.front, { transform: [{ rotateY: animFront }] }]}
      >
        <MyText style={styles.textCard}>
          {word.length >= 40 ? word.slice(0, 40) + "..." : word}
        </MyText>
      </Animated.View>
      <Animated.View
        style={[styles.back, { transform: [{ rotateY: animBack }] }]}
      >
        <MyText style={styles.textCard}>
          {showTranslation.length >= 40
            ? showTranslation.slice(0, 40) + "..."
            : showTranslation}
        </MyText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  blockTest: {
    position: "relative",
    height: "80%",
    width: 320,
  },

  front: {
    backgroundColor: Colors.backgroundColor,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    transform: [{ rotateY: "0deg" }],

    backfaceVisibility: "hidden",
    zIndex: 2,
  },

  back: {
    backgroundColor: Colors.accentColor,
    height: "100%",
    width: "100%",

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    transform: [{ rotateY: "180deg" }],

    backfaceVisibility: "hidden",
    position: "absolute",
  },

  textCard: {
    width: 200,
    textAlign: "center",
    fontWeight: 600,
    fontSize: FontSizes.MediumFSize,
  },
});
