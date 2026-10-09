import MyButton from "@/components/MyButton";
import MyText from "@/components/MyText";
import MyTextInput from "@/components/MyTextInput";
import { Colors, FontSizes } from "@/constants/constants";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";


import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { getRandomWordDB, wordProps } from "@/services/database";

type correctionType = {
  correction: string;
  error: string;
  explanation: string;
};
type correctionSType = correctionType[];

export default function writeText() {
  const [inputValue, setInputValue] = useState<string>("");
  const [corrections, setCorrections] = useState<correctionSType>([]);
  const [numberCorrect, setNumberCorrect] = useState<number>(0);
  const [showCongratulations, setShowCongratulations] =
    useState<boolean>(false);
  const [hasInternet, setHasInternet] = useState<boolean>(true);
  const [word, setWord] = useState<string | null>(
  null
  );
  const [translation, setTranslation] = useState<string | null>(
    null
  );
  const [showLoading, setShowLoading] = useState<boolean>(false);

  async function getWord() {
    let wordDB: wordProps;
    const data = await getRandomWordDB();
    if (data) {
      wordDB = data;

      // if (wordDB.word == word) {
      //   getWord();
      // }

      setWord(wordDB.word);
      setTranslation(wordDB.translation);
    }
  }

  useEffect(() => {
    getWord();
  }, []);

  const api_key: string =
    "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImY2Yzg1MTcxLTM2M2QtNDcyZC04MGQ3LWVkNWU5MDc1OTg5NCIsImV4cCI6NDkxMDY0NjEyM30.MnYd--V90KIVyR0YklTsASEQJB7dHy0jRf2KPDDqIyakBNTX9JH4s_B_FhJWWjftqQhgFF_1ExHlSUNRKx-8eg";

  async function getCorrection(model: string, text: string) {
    try {
      const response = await axios.post(
        "https://api.intelligence.io.solutions/api/v1/chat/completions",
        {
          model: model,
          messages: [
            {
              role: "system",
              content: `Ты — проверяющий ошибок в английском тексте.
              ЗАДАЧА:
              Проверь текст пользователя на грамматические, орфографические и пунктуационные ошибки.
              Исправляй минимально, не меняй смысл предложения.

              ВЫВОД — СТРОГО ТОЛЬКО JSON-МАССИВ (без пояснений, без Markdown, без текста до/после):
              - Если ошибок нет: []
              - Для КАЖДОЙ ошибки отдельный объект:
                {
                  "error": "<ошибочный фрагмент из текста>",
                  "correction": "<исправленный фрагмент>",
                  "explanation": "<очень подробно объяснение на русском, простыми словами, ≤110 символов>"
                }

              ТРЕБОВАНИЯ К ОБЪЕКТАМ:
              - "error": точная подстрока исходного текста (1–3 слова).
              - "correction": та же подстрока, но исправленная. Только нужное исправление, без перефразирования.
              - "explanation":  очень подробно и понятно для начинающего (можешь даже обьяснить быстро тему, если хватает место). Без сложных терминов. ≤110 символов.
              - Учитывай контекст. Если сомневаешься — не исправляй
              - не считать неформальность за ошибку.
              - Повторы ошибки в разных местах выводи отдельными объектами.
              - Используй только двойные кавычки. Никаких комментариев в JSON.
              - Никаких переводов текста целиком и стилистических улучшений.

              ПРИМЕР ФОРМАТА ВЫВОДА:
              [
                {
                  "error": "goes",
                  "correction": "go",
                  "explanation": "С I нужна базовая форма глагола: go, без -s."
                }
              ]

              СЕЙЧАС ПРОВЕРЬ ЭТОТ ТЕКСТ ПОЛЬЗОВАТЕЛЯ:
              {{text}}`.trim(),
            },
            {
              role: "user",
              content: text,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${api_key}`,
          },
        }
      );

      const data: any = response.data;
      const corrs: correctionSType = await JSON.parse(
        data["choices"][0]["message"]["content"]
      );

      if (corrs.length > 0) {
        console.log(corrs);
        setCorrections(corrs);
        setShowCongratulations(false);
      } else {
        setShowCongratulations(true);
        setCorrections([]);
      }

      setShowLoading(false);
      setNumberCorrect(0);
    } catch (err) {
      console.log(err);
    }
  }

  async function checkUsersInternet(): Promise<boolean | null> {
    const net = await NetInfo.fetch();
    return net.isConnected;
  }

  useFocusEffect(
    React.useCallback(() => {
      async function checkInet() {
        const hasNet = await checkUsersInternet();
        if (typeof hasNet == "boolean") {
          setHasInternet(hasNet);
        } else {
          console.log("Чото непонятное, вот: ", hasNet);
        }
      }

      checkInet();
      if (!word){
        getWord()
      }
    }, [])
  );

  async function getModels(): Promise<string[] | undefined> {
    try {
      let models: string[] = [];
      const response = await axios.get(
        "https://api.intelligence.io.solutions/api/v1/models",
        {
          headers: {
            Authorization: `Bearer ${api_key}`,
            "Content-Type": "application/json",
          },

          timeout: 5000,
        }
      );

      response.data.data.forEach((item: any) => {
        models.push(item["id"]);
      });

      console.log(models);
      return models;
    } catch (err) {
      console.log("error: ", err);
    }
  }

  function NextCorrection() {
    if (corrections.length > numberCorrect + 1) {
      setNumberCorrect(numberCorrect + 1);
    }
  }

  function PrevCorrection() {
    if (numberCorrect != 0) {
      setNumberCorrect(numberCorrect - 1);
    }
  }

  async function checkText() {
    if (inputValue.length == 0) {
      return;
    }

    setShowLoading(true);

    let data = await getModels();
    let models: string[];
    if (data) {
      models = data;

      for (const m of models) {
        try {
          console.log(m);
          await getCorrection(m, inputValue);
          break;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  return (
    <View style={styles.Wrapper}>
      <View style={styles.writeTextBlock}>
        {hasInternet && !word && !translation && (
          <>
            <View style={styles.wordBlock}>
              <MyText style={styles.internetInfo}>
                запишите слова в свой список, чтобы открыть доступ к разделу
              </MyText>
            </View>
          </>
        )}
        {!hasInternet && (
          <>
            <View style={styles.wordBlock}>
              <MyText style={styles.internetInfo}>
                Для раздела с написанием текста необходим интернет
              </MyText>
            </View>
          </>
        )}
        {translation && word && hasInternet && (
          <>
            <View style={styles.wordBlock}>
              <MyText style={styles.word}>
                {word.length >= 16 ? word.slice(0, 16) + "..." : word}
              </MyText>
              <MyText style={styles.translation}>
                {translation.length >= 30
                  ? translation.slice(0, 30) + "..."
                  : translation}
              </MyText>
            </View>
            <MyTextInput
              style={styles.usersTextInput}
              multiline={true}
              placeholder="Напиши свой текст для проверки"
              value={inputValue}
              onChangeText={(t) => setInputValue(t)}
            ></MyTextInput>

            {showLoading && (
              <View style={styles.infoBlock}>
                <MyText style={styles.infoBlock_text}>Загрузка...</MyText>
              </View>
            )}

            {!showLoading && showCongratulations && (
              <View style={styles.infoBlock}>
                <MyText style={styles.infoBlock_text}>
                  В тексте нету ошибок. Идеально!
                </MyText>
              </View>
            )}

            {!showLoading && !showCongratulations && !corrections.length && (
              <View style={styles.infoBlock}>
                <MyText style={styles.infoBlock_text}>
                  Напиши текст с выбранным словом и нажми кнопку проверить
                </MyText>
              </View>
            )}

            {!showLoading && !showCongratulations && corrections.length > 0 && (
              <View style={styles.infoBlockCorrections}>
                <View style={styles.texts}>
                  <MyText style={styles.textError}>
                    <MyText style={{ color: Colors.dangerColor }}>
                      Ошибка:
                    </MyText>{" "}
                    {corrections[numberCorrect].error}
                    {/* <MyText style={{ color: Colors.dangerColor }}>Ошибка: </MyText> */}
                    {/* app */}
                  </MyText>
                  <MyText style={styles.textCorrection}>
                    <MyText style={{ color: Colors.accentColor }}>
                      Правильно:
                    </MyText>{" "}
                    {/* the app */}
                    {corrections[numberCorrect].correction}
                  </MyText>
                  <MyText style={styles.textExplanation}>
                    {corrections[numberCorrect].explanation}
                    {/* Перед существительным "app" требуется определённый артикль
                "the", поскольку речь идёт о конкретном приложении. */}
                  </MyText>
                </View>
                <View style={styles.navigations}>
                  <MaterialIcons
                    name="arrow-back"
                    color={Colors.GreyWhiteColor}
                    size={22}
                    style={{
                      opacity: numberCorrect === 0 ? 0 : 1,
                    }}
                    pointerEvents={numberCorrect === 0 ? "none" : "auto"}
                    onPress={() => PrevCorrection()}
                  ></MaterialIcons>
                  <MaterialIcons
                    name="arrow-forward"
                    color={Colors.GreyWhiteColor}
                    size={22}
                    style={{
                      opacity: corrections.length === numberCorrect + 1 ? 0 : 1,
                    }}
                    pointerEvents={
                      corrections.length === numberCorrect + 1 ? "none" : "auto"
                    }
                    onPress={() => NextCorrection()}
                  ></MaterialIcons>
                </View>
              </View>
            )}
            <View style={styles.buttonsBlock}>
              <MyButton
                style={[styles.button, styles.buttonCheck]}
                onPress={() => getWord()}
                version="v2"
              >
                другое слово
              </MyButton>
              <MyButton
                style={[styles.button, styles.buttonCheck]}
                onPress={() => checkText()}
              >
                проверить
              </MyButton>
            </View>
          </>
        )}
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
  writeTextBlock: {
    width: "96%",
    height: "92%",
    paddingTop: 60,
    alignItems: "center",
    gap: "2%",
    backgroundColor: Colors.GreyColor,
    borderRadius: 20,
  },

  wordBlock: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 26,
    gap: 1,
  },

  internetInfo: {
    width: 220,
    textAlign: "center",
  },

  word: {
    fontSize: FontSizes.LargeFSize,
  },
  translation: {
    fontSize: FontSizes.SecondaryFSize,
    color: Colors.GreyWhiteColor,
  },

  usersTextInput: {
    width: "90%",
    height: "46%",
    borderRadius: 20,
    paddingTop: 16,
    textAlignVertical: "top",
  },

  infoBlock: {
    width: "90%",
    height: 170,
    borderRadius: 20,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },

  infoBlockCorrections: {
    width: "90%",
    height: 170,

    borderRadius: 20,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },

  texts: {
    height: "70%",
  },

  navigations: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBlock_text: {
    width: "90%",
    textAlign: "center",
  },

  buttonsBlock: {
    flexDirection: "row",
    width: "90%",
    gap: "4%",
    height: "8%",
  },

  textExplanation: {
    fontSize: FontSizes.SecondaryFSize,
  },
  textCorrection: {
    marginTop: 2,
    marginBottom: 10,
  },
  textError: {},

  button: {
    width: "48%",
    height: "100%",
  },

  buttonCheck: {},
});
