// app/(auth)/LoginScreen.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState(""); // puede ser correo o username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("⚠️ Campos incompletos", "Por favor ingresa usuario y contraseña");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Éxito", `Bienvenido ${data.username}`);
        // redirige según tipo de usuario: cliente o técnico
        // por ahora, asumimos que si tiene dashboard técnico -> técnico
        // ⚠️ luego se puede mejorar enviando rol desde backend
        if (data.is_tecnico) {
          router.replace("/(main)/TechnicianDashboard");
        } else {
          router.replace("/(main)/HomeScreen");
        }
      } else {
        Alert.alert("❌ Error", data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("❌ Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servipana</Text>

      <TextInput
        placeholder="Usuario o correo"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cargando..." : "Iniciar sesión"}</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>¿No tienes cuenta?</Text>

      <View style={styles.registerButtons}>
        <TouchableOpacity
          style={[styles.registerButton, styles.clientButton]}
          onPress={() => router.push("/(auth)/RegisterClienteScreen")}
        >
          <Text style={styles.registerText}>Registrarme como Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.registerButton, styles.techButton]}
          onPress={() => router.push("/(auth)/RegisterTecnicoScreen")}
        >
          <Text style={styles.registerText}>Registrarme como Técnico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f2f2f7" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#111827" },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subtitle: { textAlign: "center", fontSize: 14, color: "#6b7280", marginBottom: 10 },
  registerButtons: { flexDirection: "column", gap: 12 },
  registerButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  clientButton: { backgroundColor: "#10b981" },
  techButton: { backgroundColor: "#f59e0b" },
  registerText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
