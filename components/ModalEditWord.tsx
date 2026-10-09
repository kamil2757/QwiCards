import { Colors, FontSizes } from "@/constants/constants";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import MyTextInput from "./MyTextInput";
import MyButton from "./MyButton";
import { MyContext } from "@/MyContext";
import { useContext, useEffect, useState, version } from "react";
import { deleteWordDB, updateWordDB } from "@/services/database";

interface ModalEditWordProps {
  onClose: () => void;
  isVisible: boolean;
  word: string;
  translation: string;
}

export default function ModalEditWord({
  onClose,
  isVisible,
  word,
  translation,
}: ModalEditWordProps) {
  const [wordInp, setWordInp] = useState<string>("");
  const [translationInp, setTranslationInp] = useState<string>("");

  useEffect(() => {
    setWordInp(word);
  }, [word]);

  useEffect(() => {
    setTranslationInp(translation);
  }, [translation]);

  const context = useContext(MyContext);
  if (!context) {
    throw new Error("HomeScreen must be used within a MyContext.Provider");
  }
  const { refresh, setRefresh } = context;

  async function deleteWord() {
    await deleteWordDB(word.trim());
    setRefresh(true);
    onClose();
  }

  async function editWord() {

    if (word.trim() === wordInp.trim() && translation.trim() == translationInp.trim()) {
      console.log("ничо не делаем, ничо не изменилось");
      return;
    }

    await updateWordDB(wordInp.trim(), translationInp.trim(), word.trim());
    setRefresh(true);
    onClose();
  }

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
      transparent={true}
    >
      <Pressable onPress={onClose} style={styles.ModalWrapper}>
        <Pressable style={styles.ModalBlock}>
          <View style={styles.inputsBl}>
            <MyTextInput
              style={styles.input}
              value={wordInp}
              onChangeText={(t) => setWordInp(t)}
            ></MyTextInput>
            <MyTextInput
              style={styles.input}
              value={translationInp}
              onChangeText={(t) => setTranslationInp(t)}
            ></MyTextInput>
          </View>
          <View style={styles.buttonsBl}>
            <MyButton style={styles.buttonDel} onPress={() => deleteWord()}  version='v2'>
              Удалить
            </MyButton>
            <MyButton style={styles.buttonEdit} onPress={() => editWord()}>
              Изменить
            </MyButton>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const buttonST = {
  width: 120,
  height: 46,
};

const styles = StyleSheet.create({
  ModalWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(20, 20, 26, 0.5)",
  },

  ModalBlock: {
    width: "90%",
    alignItems: "center",
    gap: 20,
    backgroundColor: Colors.GreyColor,
    borderRadius: 20,
    padding: 26,
  },

  inputsBl: {
    width: "100%",
    gap: 10,
  },

  buttonsBl: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  input: {
    width: "100%",
    height: 56,
  },

  buttonDel: {
    ...buttonST,
    backgroundColor: Colors.GreyColor,
    borderWidth: 2,
    borderColor: Colors.accentColor,
  },
  buttonEdit: {
    ...buttonST,
  },
});
