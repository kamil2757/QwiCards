import React, { useState } from "react";
import MyText from "@/components/MyText";
import { Colors } from "@/constants/constants";
import { MyContext } from "@/MyContext";
import {
  deleteTable,
  getWordCards,
  UpdateWordLevel,
  wordProps,
} from "@/services/database";
import { useFocusEffect } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import CardAnimation from "@/components/CardAnimation";

export default function cards() {
  const context = useContext(MyContext);
  const [cards, setCards] = useState<Array<wordProps>>();
  const [refreshC, setRefreshC] = useState(false);
  const [numberShowCard, setNumberShowCard] = useState<number>(1);
  const [doAnimation, setDoAnimation] = useState<boolean>(false);

  if (!context) {
    throw new Error("HomeScreen must be used within a MyContext.Provider");
  }
  const { refresh, setRefresh, modalInfo, setModalInfo } = context;

  async function getWordsFunc() {
    const data = await getWordCards();
    let cards: Array<wordProps>;
    if (data) {
      cards = data;

      console.log(cards);
      setCards(cards);
      setNumberShowCard(1);
    }
  }

  useEffect(() => {
    if (cards) {
      console.log("cards: ", cards);
    }
  }, [cards]);

  useFocusEffect(
    React.useCallback(() => {
      getWordsFunc();
    }, [refreshC])
  );

  function onPressBtn(know: boolean) {
    if (cards) {
      UpdateWordLevel(cards[numberShowCard - 1]?.id, know);
      setNumberShowCard(numberShowCard + 1);

      setDoAnimation(true);
    }
  }

  return (
    <View style={styles.Wrapper}>
      <View style={styles.cardsBlock}>
        {cards && cards[numberShowCard - 1] && (
          <>
            <MyText style={styles.ProgressText}>
              Прогресс: {numberShowCard - 1} / {cards?.length}
            </MyText>
            <CardAnimation
              word={cards[numberShowCard - 1].word}
              translation={cards[numberShowCard - 1].translation}
              doAnimation={doAnimation}
              setDoAnimation={(bool) => setDoAnimation(bool)}
            ></CardAnimation>
            <View style={styles.buttons}>
              <Pressable
                style={[styles.button, styles.notKnow]}
                onPress={() => onPressBtn(false)}
              >
                <MyText>Не знаю</MyText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.know]}
                onPress={() => onPressBtn(true)}
              >
                <MyText>Знаю</MyText>
              </Pressable>
            </View>
          </>
        )}

        {!cards ||
          (cards.length == 0 && (
            <>
              <MyText>Нету слов для повторение</MyText>
              <Pressable></Pressable>
            </>
          ))}
        {!cards ||
          (cards.length > 0 && !cards[numberShowCard - 1] && (
            <MyText>Ура, вы все повторили!</MyText>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Wrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingBottom: 10,
  },
  cardsBlock: {
    width: "96%",
    height: "92%",
    paddingTop: 40,
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.GreyColor,
    borderRadius: 20,
  },

  ProgressText: {
    paddingBottom: 10,
  },

  buttons: {
    width: 320,
    flexDirection: "row",
    gap: 10,
    height: 62,
    marginTop: 8,
  },

  button: {
    width: 155,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 11,
  },

  notKnow: {
    backgroundColor: Colors.dangerColor,
  },

  know: {
    backgroundColor: Colors.accentColor,
  },
});
