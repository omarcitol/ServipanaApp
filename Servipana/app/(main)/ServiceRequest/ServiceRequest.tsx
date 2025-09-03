import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function ServiceRequest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (!description || !address) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    Alert.alert("Solicitud enviada", `Se envió la solicitud al técnico ID ${id}`);
    console.log("Solicitud:", { tecnicoId: id, description, address });

    router.push("/HomeScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitud de Servicio</Text>
      <Text>Técnico seleccionado: {id}</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe tu necesidad..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección del servicio..."
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Enviar Solicitud" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15, minHeight: 50 },
});
