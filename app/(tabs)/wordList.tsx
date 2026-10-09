import MyText from "@/components/MyText";
import { FontSizes, Colors } from "@/constants/constants";
import { MyContext } from "@/MyContext";
import { getWordsDB, wordProps } from "@/services/database";
import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import OpenTranslationAnimation from "@/components/OpenTranslationAnimation";
import ModalEditWord from "@/components/ModalEditWord";

export default function wordList() {
  const [words, setWords] = useState<wordProps[]>();
  const context = useContext(MyContext);
  const [isVisibleModule, setIsVisibleModule] = useState<boolean>(false);

  if (!context) {
    throw new Error("HomeScreen must be used within a MyContext.Provider");
  }

  const { refresh, setRefresh, modalInfo, setModalInfo } = context;

  useEffect(() => {
    getWordsList();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    if (!modalInfo.translation) return;
    setIsVisibleModule(true);
  }, [, modalInfo]);

  async function getWordsList() {
    const data: Array<wordProps> = await getWordsDB();

    if (data) {
      console.log(data)
      setWords(data);
    }
  }

  function closeModal() {
    setModalInfo({ word: "", translation: "" });
    setIsVisibleModule(false);
  }

  return (
    <View style={styles.Wrapper}>
      <View style={styles.wordListBlock}>
        <MyText style={styles.headerText}>Список ваших слов</MyText>
        <ScrollView style={styles.wordsBlock}>
          {!words || words.length == 0  && (
            <View style={styles.messageBlock}>
              <MyText style={styles.messageText}>
                У вас пока нет слов. Добавляйте их на главной странице.
              </MyText>
            </View>
          )}
          {words &&
            words?.map((item: { word: string; translation: string }, index) => (
              <OpenTranslationAnimation
                word={item.word}
                translation={item.translation}
                key={index}
              />
            ))}
        </ScrollView>
      </View>

      <ModalEditWord
        isVisible={isVisibleModule}
        onClose={() => closeModal()}
        word={modalInfo.word}
        translation={modalInfo.translation}
      />
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
  wordListBlock: {
    width: "96%",
    height: "92%",
    alignItems: "center",
    gap: 20,
    backgroundColor: Colors.GreyColor,
    borderRadius: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: FontSizes.LargeFSize,
    marginBottom: 18,
    paddingTop: 50,
  },
  wordsBlock: {
    display: "flex",
    width: "90%",
    maxHeight: 600,
  },

  messageBlock: {
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    borderRadius: 20,
  },

  messageText: {
    width: 300,
    textAlign: "center",
    lineHeight: 24,
  },
});
