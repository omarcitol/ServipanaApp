import { useRouter } from "expo-router";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Página de Prueba</Text>
      <Text style={styles.subtitle}>Navega a cualquier pantalla:</Text>

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => router.push("/(auth)/LoginScreen")} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Home" onPress={() => router.push("/(main)/HomeScreen")} />
      </View>

      <View style={styles.buttonContainer}>
        {/* Aquí probamos un perfil técnico de ejemplo */}
        <Button title="Perfil Técnico (ID 1)" onPress={() => router.push("/(main)/TechnicianProfile/1")} />
      </View>

      <View style={styles.buttonContainer}>
        {/* Aquí probamos la solicitud de servicio para el técnico ID 1 */}
        <Button title="Solicitar Servicio (ID 1)" onPress={() => router.push("/(main)/ServiceRequest/1")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#38434D",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 8,
  },
});
