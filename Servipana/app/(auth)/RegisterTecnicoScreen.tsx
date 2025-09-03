import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Button, Image, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { registerTecnico } from "../services/api";

const RegisterTecnicoScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [servicios, setServicios] = useState<number[]>([]);
  const [cedula, setCedula] = useState<{ uri: string } | null>(null);
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [trabajos, setTrabajos] = useState<{ uri: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Funciones para seleccionar imágenes
  const pickImage = async (setter: (img: { uri: string }) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setter({ uri: result.assets[0].uri });
    }
  };

  const pickMultipleImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({ uri: asset.uri }));
      setTrabajos((prev) => [...prev, ...newImages]);
    }
  };

  const toggleServicio = (id: number) => {
    setServicios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !telefono || !especialidad || servicios.length === 0) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos");
      return;
    }
    setLoading(true);
    try {
      const res = await registerTecnico({
        username,
        email,
        password,
        telefono,
        especialidad,
        experiencia,
        servicios,
        cedula: cedula || undefined,
        image: image || undefined,
        trabajos: trabajos.length ? trabajos : undefined,
      });
      Alert.alert("Éxito", "Técnico registrado correctamente");
      console.log(res);
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Aquí puedes personalizar tu lista de servicios
  const serviciosDisponibles = [
    { id: 1, nombre: "Fontanería" },
    { id: 2, nombre: "Electricidad" },
    { id: 3, nombre: "Limpieza" },
    { id: 4, nombre: "Pintura" },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} keyboardType="email-address" />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry />

      <Text>Teléfono</Text>
      <TextInput value={telefono} onChangeText={setTelefono} style={{ borderWidth: 1, marginBottom: 10 }} keyboardType="phone-pad" />

      <Text>Especialidad</Text>
      <TextInput value={especialidad} onChangeText={setEspecialidad} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Experiencia (opcional)</Text>
      <TextInput value={experiencia} onChangeText={setExperiencia} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Servicios</Text>
      {serviciosDisponibles.map((s) => (
        <TouchableOpacity key={s.id} onPress={() => toggleServicio(s.id)} style={{ marginVertical: 5 }}>
          <Text style={{ color: servicios.includes(s.id) ? "green" : "black" }}>{s.nombre}</Text>
        </TouchableOpacity>
      ))}

      <Text>Cédula</Text>
      <Button title="Seleccionar cédula" onPress={() => pickImage(setCedula)} />
      {cedula && <Image source={{ uri: cedula.uri }} style={{ width: 100, height: 100, marginVertical: 10 }} />}

      <Text>Foto de perfil</Text>
      <Button title="Seleccionar foto de perfil" onPress={() => pickImage(setImage)} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginVertical: 10 }} />}

      <Text>Trabajos</Text>
      <Button title="Seleccionar trabajos" onPress={pickMultipleImages} />
      <ScrollView horizontal>
        {trabajos.map((t, i) => (
          <Image key={i} source={{ uri: t.uri }} style={{ width: 100, height: 100, margin: 5 }} />
        ))}
      </ScrollView>

      <Button title={loading ? "Registrando..." : "Registrar Técnico"} onPress={handleRegister} disabled={loading} />
    </ScrollView>
  );
};

export default RegisterTecnicoScreen;
