import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <Text style={styles.title}>Página não encontrada</Text>
      <Link href="/" style={styles.link}>Voltar ao quadro</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#171020",
  },
  title: { color: "#ffffff", fontSize: 24 },
  link: { color: "#e5c35a", fontSize: 18 },
});
