import MyText from "@/components/MyText";
import { Colors, FontSizes } from "@/constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function repetition() {
  type methodsTypes = {
    MethodN: string;
    href: Href;
    imgName:  React.ComponentProps<typeof MaterialIcons>['name'];
  };
  const methods: Array<methodsTypes> = [
    {
      MethodN: "Карточки",
      href: "/repetition/cards" as Href,
      imgName: "view-carousel",
    },
    {
      MethodN: "Написание текста",
      href: "/repetition/writeText" as Href,
      imgName: "assignment",
    },
  ];

  return (
    <View style={styles.Wrapper}>
      <View style={styles.MethodsBlock}>
        {methods.map((method, index) => (
          <Link href={method.href} key={index} style={styles.LinkBlock}>
            <View style={styles.TextBlock}>
              <MaterialIcons
                name={method.imgName}
                size={34}
                color={Colors.GreyWhiteColor}
              />
              <MyText>{method.MethodN}</MyText>
            </View>
          </Link>
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
  MethodsBlock: {
    width: "96%",
    height: "92%",
    paddingTop: 40,
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.GreyColor,
    borderRadius: 20,
  },

  LinkBlock: {
    width: "90%",
  },

  TextBlock: {
    height: 60,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 16,
    width: "100%",
    paddingStart: 20,
    gap: 14,
    flexDirection: "row",
    alignItems: "center",
  },
});
