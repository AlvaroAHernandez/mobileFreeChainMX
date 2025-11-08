// app/screens/club/create.tsx
import ScreenLayout from '@/components/ScreenLayout';
import { ThemedText } from '@/components/themed-text';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors, Radius } from '@/constants/theme';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ClubCreateScreen() {
  const gs = useGlobalStyles();
  const router = useRouter();
  const Colors = getThemeColors('dark');
  const { loading, createOrganization, pickImage } = useCreateOrganization();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
  });
  const [logo, setLogo] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagePick = async () => {
    const imageFile = await pickImage();
    if (imageFile) {
      setLogo(imageFile);
      setLogoPreview(imageFile.uri);
    }
  };

  const handleRemoveImage = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleCreateClub = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del club es obligatorio');
      return;
    }

    await createOrganization({
      ...formData,
      logo_file: logo
    });
  };

  const handleCancel = () => {
    if (formData.name || formData.description || formData.address) {
      Alert.alert(
        '¿Seguro quieres cancelar?',
        'Se perderán los datos ingresados',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { 
            text: 'Sí, cancelar', 
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <ScreenLayout title="CREAR CLUB">
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.subtitle}>
            Completa la información para crear tu club de motociclistas
          </ThemedText>
        </View>

        {/* Sección de Logo */}
        <View style={[gs.card, styles.section]}>
          <ThemedText style={styles.sectionTitle}>Logo del Club</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Agrega un logo representativo (opcional)
          </ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.imagePicker, 
              { borderColor: Colors.border, backgroundColor: Colors.surface }
            ]}
            onPress={handleImagePick}
          >
            {logoPreview ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: logoPreview }} 
                  style={styles.imagePreview}
                />
                <TouchableOpacity 
                  style={[styles.removeImageBtn, { backgroundColor: Colors.danger }]}
                  onPress={handleRemoveImage}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={Colors.textSecondary} />
                <ThemedText style={[styles.imagePlaceholderText, { color: Colors.textSecondary }]}>
                  Agregar logo
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Sección de Información Básica */}
        <View style={[gs.card, styles.section]}>
          <ThemedText style={styles.sectionTitle}>Información Básica</ThemedText>
          
          {/* Nombre */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Nombre del Club <ThemedText style={{ color: Colors.danger }}>*</ThemedText>
            </ThemedText>
            <TextInput
              placeholder="Ej: Riders del Valle"
              placeholderTextColor={Colors.textSecondary}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={[
                styles.input,
                { 
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: formData.name ? Colors.success : Colors.border
                }
              ]}
              maxLength={50}
            />
            <ThemedText style={styles.charCount}>
              {formData.name.length}/50
            </ThemedText>
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Descripción</ThemedText>
            <TextInput
              placeholder="Describe los objetivos y actividades de tu club..."
              placeholderTextColor={Colors.textSecondary}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              style={[
                styles.textArea,
                { 
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: Colors.border
                }
              ]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={200}
            />
            <ThemedText style={styles.charCount}>
              {formData.description.length}/200
            </ThemedText>
          </View>

          {/* Ubicación */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Ubicación</ThemedText>
            <TextInput
              placeholder="Ciudad, Estado o dirección..."
              placeholderTextColor={Colors.textSecondary}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              style={[
                styles.input,
                { 
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: Colors.border
                }
              ]}
            />
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              { 
                backgroundColor: formData.name ? Colors.tint : Colors.textMuted,
                opacity: loading ? 0.7 : 1
              }
            ]}
            onPress={handleCreateClub}
            disabled={!formData.name || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <ThemedText style={styles.createButtonText}>
                  Crear MotoClub
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cancelButton,
              { borderColor: Colors.border }
            ]}
            onPress={handleCancel}
            disabled={loading}
          >
            <ThemedText style={[styles.cancelButtonText, { color: Colors.text }]}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'right',
    marginTop: 4,
  },
  imagePicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.medium,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Radius.medium,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: Radius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});