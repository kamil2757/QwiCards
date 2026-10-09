import { StyleSheet, View } from "react-native";

import MyButton from "@/components/MyButton";
import MyText from "@/components/MyText";
import MyTextInput from "@/components/MyTextInput";
import { Colors, FontSizes } from "@/constants/constants";
import { useContext, useState } from "react";
import { saveWordDB } from "@/services/database";
import { MyContext } from "@/MyContext";

export default function HomeScreen() {
  const [valueWordInp, setValueWordInp] = useState<string>("");
  const [valueTranslateInp, setValueTranslateInp] = useState<string>("");
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("HomeScreen must be used within a MyContext.Provider");
  }

  const { refresh, setRefresh } = context;

  async function SaveWord() {
    const word = valueWordInp.trim();
    const translation = valueTranslateInp.trim();

    if (!(word && translation)) {
      console.log("не все поля заполнены");
      return;
    }

    await saveWordDB(word, translation);
    setRefresh(true);
    setValueTranslateInp("");
    setValueWordInp("");
  }

  return (
    <View style={styles.Wrapper}>
      <View style={styles.addBlock}>
        <MyText style={styles.headerText}>Введите новое слово</MyText>
        <View style={styles.inputBlock}>
          <MyTextInput
            placeholder="Слово"
            style={styles.input}
            value={valueWordInp}
            onChangeText={(t) => setValueWordInp(t)}
          ></MyTextInput>
          <MyTextInput
            placeholder="Перевод"
            style={styles.input}
            value={valueTranslateInp}
            onChangeText={(t) => setValueTranslateInp(t)}
          ></MyTextInput>
        </View>
        <MyButton style={styles.button} onPress={() => SaveWord()}>
          Сохранить
        </MyButton>
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

  addBlock: {
    width: "96%",
    height: "92%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.GreyColor,
    borderRadius: 20,
  },

  headerText: {
    width: 200,
    textAlign: "center",
    fontSize: FontSizes.LargeFSize,
    marginBottom: 24,
  },

  inputBlock: {
    gap: 6,
  },

  input: {
    width: 280,
    height: 60,
    paddingStart: 20,
    borderRadius: 16,
  },

  button: {
    marginTop: 16,
    width: 280,
    height: 56,
    borderRadius: 16,
  },
});
