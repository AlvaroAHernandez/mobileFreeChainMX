// app/screens/profile/profile.tsx
import ScreenLayout from '@/components/ScreenLayout';
import { ThemedText } from '@/components/themed-text';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors, Radius } from '@/constants/theme';
import { useProfile } from '@/hooks/useProfile';
import { useRefresh } from '@/hooks/useRefresh';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const gs = useGlobalStyles();
  const Colors = getThemeColors('dark');
  const router = useRouter();
  
  const { profile, loading, updating, updateProfile, pickImage, fetchProfile } = useProfile();
  const { refreshing, onRefresh } = useRefresh(fetchProfile);

  // Estado local para el formulario
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    phone_number: '',
    email: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Actualizar formulario cuando se cargan los datos
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        lastname: profile.lastname || '',
        phone_number: profile.phone_number || '',
        email: profile.email || '',
      });
      setPhotoPreview(profile.full_profile_photo_url);
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    await updateProfile({
      ...formData,
      profile_photo_file: profilePhoto
    });
  };

  const handleChangePhoto = async () => {
    const imageFile = await pickImage();
    if (imageFile) {
      setProfilePhoto(imageFile);
      setPhotoPreview(imageFile.uri);
    }
  };

  if (loading && !profile) {
    return (
      <ScreenLayout title="Mi Perfil">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando perfil...</ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Mi Perfil" onRefresh={onRefresh} refreshing={refreshing}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header con foto de perfil */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleChangePhoto} style={styles.photoContainer}>
            {photoPreview ? (
              <Image 
                source={{ uri: photoPreview }} 
                style={styles.profilePhoto}
              />
            ) : (
              <View style={[styles.profilePhoto, styles.photoPlaceholder]}>
                <Ionicons name="person" size={32} color={Colors.textSecondary} />
              </View>
            )}
            <View style={[styles.editPhotoBadge, { backgroundColor: Colors.tint }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>
              {profile?.name || 'Usuario'}
            </ThemedText>
            <ThemedText style={styles.profileEmail}>
              {profile?.email}
            </ThemedText>
            {(profilePhoto || photoPreview !== profile?.full_profile_photo_url) && (
              <ThemedText style={styles.photoChangedText}>
                Foto pendiente de guardar ✅
              </ThemedText>
            )}
          </View>
        </View>

        {/* Información personal */}
        <View style={[gs.card, styles.section]}>
          <ThemedText style={styles.sectionTitle}>Información Personal</ThemedText>
          
          {/* Nombre */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombre *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: formData.name ? Colors.success : Colors.border
                }
              ]}
              placeholder="Tu nombre"
              placeholderTextColor={Colors.textSecondary}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          {/* Apellido */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Apellido</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: Colors.border
                }
              ]}
              placeholder="Tu apellido"
              placeholderTextColor={Colors.textSecondary}
              value={formData.lastname}
              onChangeText={(value) => handleInputChange('lastname', value)}
            />
          </View>

          {/* Teléfono */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Teléfono</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: Colors.border
                }
              ]}
              placeholder="+34 600 000 000"
              placeholderTextColor={Colors.textSecondary}
              value={formData.phone_number}
              onChangeText={(value) => handleInputChange('phone_number', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email (solo lectura) */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  color: Colors.textMuted,
                  backgroundColor: Colors.inputBackground,
                  borderColor: Colors.border
                }
              ]}
              value={formData.email}
              editable={false}
              placeholderTextColor={Colors.textSecondary}
            />
            <ThemedText style={styles.helperText}>
              El email no se puede cambiar
            </ThemedText>
          </View>

          {/* Indicador de cambios pendientes */}
          {(formData.name !== profile?.name || 
            formData.lastname !== profile?.lastname || 
            formData.phone_number !== profile?.phone_number ||
            profilePhoto) && (
            <View style={[styles.changesIndicator, { backgroundColor: Colors.tint }]}>
              <Ionicons name="information-circle" size={16} color="#fff" />
              <ThemedText style={styles.changesText}>
                Tienes cambios pendientes de guardar
              </ThemedText>
            </View>
          )}

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              { 
                backgroundColor: formData.name ? Colors.tint : Colors.textMuted,
                opacity: updating ? 0.7 : 1
              }
            ]}
            onPress={handleSaveProfile}
            disabled={!formData.name || updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <ThemedText style={styles.saveButtonText}>
                  {updating ? 'Guardando...' : 'Guardar Cambios'}
                </ThemedText>
              </>
            )}
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  photoChangedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  changesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  changesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.medium,
    gap: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clinicTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  clinicContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  clinicMessage: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  addClinicButton: {
    paddingVertical: 12,
    borderRadius: Radius.medium,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  addClinicText: {
    fontSize: 14,
    fontWeight: '600',
  },
});