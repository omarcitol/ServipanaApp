// app/(main)/ServiceRequestCreate.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export default function ServiceRequestCreate() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!address || !description) {
      Alert.alert("⚠️ Campos incompletos", "Por favor, llena todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/solicitudes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          description,
          tecnico: 1, // 🔧 de momento fijo (luego dinámico)
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.log("❌ Error:", errData);
        Alert.alert("Error", "No se pudo crear la solicitud.");
        return;
      }

      const data = await response.json();
      Alert.alert("✅ Éxito", "Solicitud creada correctamente");
      router.push(`/ServiceRequestDetail?id=${data.id}`); // vamos al detalle
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      Alert.alert("Error", "Hubo un problema al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Nueva Solicitud</Text>

      <Text style={styles.label}>📌 Dirección</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Av. Bolívar #123"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>🛠️ Descripción del servicio</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej: Necesito un plomero para reparar una fuga"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>📤 Enviar Solicitud</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
