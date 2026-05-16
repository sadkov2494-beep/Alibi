import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../theme';

interface HintShopScreenProps {
  hintsAvailable: number;
  adsRemoved: boolean;
  onBack: () => void;
  onAddHints: (count: number) => void;
}

export const HintShopScreen = ({ hintsAvailable, adsRemoved, onBack, onAddHints }: HintShopScreenProps) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Button title="← Назад" onPress={onBack} variant="ghost" />
    <View>
      <Text style={styles.title}>Магазин подсказок</Text>
      <Text style={styles.subtitle}>MVP использует локальные заглушки. Позже сюда можно подключить AdMob и in-app purchases.</Text>
    </View>

    <Card highlighted>
      <Text style={styles.balance}>Доступно подсказок: {hintsAvailable}</Text>
      <Text style={styles.text}>Подсказки открываются по уровням: легкая, средняя, сильная.</Text>
    </Card>

    <View style={styles.offers}>
      <Card>
        <Text style={styles.offerIcon}>🎬</Text>
        <Text style={styles.offerTitle}>Вознаграждаемая реклама</Text>
        <Text style={styles.text}>Заглушка: кнопка сразу добавляет одну подсказку.</Text>
        <Button title="Посмотреть рекламу (+1)" onPress={() => onAddHints(1)} variant="secondary" />
      </Card>

      <Card>
        <Text style={styles.offerIcon}>💡</Text>
        <Text style={styles.offerTitle}>Набор подсказок</Text>
        <Text style={styles.text}>Локальная покупка без реальной оплаты для проверки экономики MVP.</Text>
        <Button title="Получить набор (+5)" onPress={() => onAddHints(5)} />
      </Card>

      <Card>
        <Text style={styles.offerIcon}>🚫</Text>
        <Text style={styles.offerTitle}>Отключение рекламы</Text>
        <Text style={styles.text}>{adsRemoved ? 'Реклама отключена.' : 'Премиум-покупка запланирована для будущего SDK.'}</Text>
        <Button title={adsRemoved ? 'Куплено' : 'Скоро'} onPress={() => undefined} disabled variant="ghost" />
      </Card>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.sm,
  },
  balance: {
    ...typography.h2,
    color: colors.primary,
  },
  text: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  offers: {
    gap: spacing.md,
  },
  offerIcon: {
    fontSize: 38,
  },
  offerTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.sm,
  },
});
