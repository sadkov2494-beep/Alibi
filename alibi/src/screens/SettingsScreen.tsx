import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../theme';
import { PlayerSettings } from '../types';

interface SettingsScreenProps {
  settings: PlayerSettings;
  onBack: () => void;
  onUpdateSettings: (settings: Partial<PlayerSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsScreen = ({ settings, onBack, onUpdateSettings, onResetProgress }: SettingsScreenProps) => {
  const confirmReset = () => {
    Alert.alert('Сбросить прогресс?', 'Откроется только первое дело, подсказки вернутся к стартовому значению.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Сбросить', style: 'destructive', onPress: onResetProgress },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="← Назад" onPress={onBack} variant="ghost" />
      <Text style={styles.title}>Настройки</Text>

      <Card>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Звук</Text>
            <Text style={styles.settingDescription}>Эффекты интерфейса и будущие звуки улик.</Text>
          </View>
          <Button title={settings.sound ? 'Вкл' : 'Выкл'} onPress={() => onUpdateSettings({ sound: !settings.sound })} variant="secondary" style={styles.smallButton} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Музыка</Text>
            <Text style={styles.settingDescription}>Фоновая музыка для уютного детектива.</Text>
          </View>
          <Button title={settings.music ? 'Вкл' : 'Выкл'} onPress={() => onUpdateSettings({ music: !settings.music })} variant="secondary" style={styles.smallButton} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Язык</Text>
            <Text style={styles.settingDescription}>Сейчас доступен русский, структура готова к локализации.</Text>
          </View>
          <Button title="RU" onPress={() => onUpdateSettings({ language: 'ru' })} variant="ghost" style={styles.smallButton} />
        </View>
      </Card>

      <Card highlighted>
        <Text style={styles.settingTitle}>Прогресс</Text>
        <Text style={styles.settingDescription}>Локальное сохранение хранит открытые дела, звезды, подсказки и настройки.</Text>
        <Button title="Сбросить прогресс" onPress={confirmReset} variant="danger" style={styles.resetButton} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.h2,
    color: colors.text,
  },
  settingDescription: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
  smallButton: {
    minHeight: 44,
    minWidth: 82,
  },
  resetButton: {
    marginTop: spacing.lg,
  },
});
