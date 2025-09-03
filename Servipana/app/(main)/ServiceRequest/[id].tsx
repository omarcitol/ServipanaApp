import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ServiceRequest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("🟢 Botón presionado con datos:", { id, description, address });

    if (!description || !address) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/solicitudes/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
        cliente: 1,  // o el id real del cliente logueado
        servicio: id,
        descripcion: description,
        direccion: address,
      })

      });

      console.log("🔎 Status de la API:", response.status);

      // Si la API devuelve HTML (por error Django), lo detectamos
      const text = await response.text();
      console.log("📩 Respuesta cruda:", text);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = JSON.parse(text);
      console.log("✅ Solicitud creada:", data);

      Alert.alert("Éxito", "Tu solicitud se ha enviado correctamente");
      router.push("/(main)/MyRequests");
    } catch (err: any) {
      console.error("❌ Error en submit:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Solicitud de Servicio</Text>
        <Text style={styles.subtitle}>Técnico seleccionado: {id}</Text>

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

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📩 Enviar Solicitud</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
