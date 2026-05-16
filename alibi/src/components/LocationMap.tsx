import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { transportLabels } from '../utils/format';
import { Card } from './Card';

interface LocationMapProps {
  caseData: CaseData;
}

export const LocationMap = ({ caseData }: LocationMapProps) => {
  const [selectedLocationId, setSelectedLocationId] = useState(caseData.crimeLocationId);
  const selectedLocation = caseData.locations.find((location) => location.id === selectedLocationId);

  const routeSummaries = useMemo(
    () =>
      caseData.routes.map((route) => {
        const from = caseData.locations.find((location) => location.id === route.from)?.name ?? route.from;
        const to = caseData.locations.find((location) => location.id === route.to)?.name ?? route.to;
        const minutes = [
          route.walkMinutes ? `${transportLabels.walk}: ${route.walkMinutes} мин` : null,
          route.carMinutes ? `${transportLabels.car}: ${route.carMinutes} мин` : null,
          route.busMinutes ? `${transportLabels.bus}: ${route.busMinutes} мин` : null,
          route.metroMinutes ? `${transportLabels.metro}: ${route.metroMinutes} мин` : null,
          route.taxiMinutes ? `${transportLabels.taxi}: ${route.taxiMinutes} мин` : null,
        ]
          .filter(Boolean)
          .join(' · ');

        return { ...route, from, to, minutes };
      }),
    [caseData.locations, caseData.routes],
  );

  return (
    <View style={styles.wrap}>
      <Card>
        <View style={styles.mapCanvas}>
          {caseData.routes.map((route) => {
            const from = caseData.locations.find((location) => location.id === route.from);
            const to = caseData.locations.find((location) => location.id === route.to);

            if (!from || !to) {
              return null;
            }

            const left = Math.min(from.x, to.x);
            const top = Math.min(from.y, to.y);
            const width = Math.max(Math.abs(from.x - to.x), 8);
            const height = Math.max(Math.abs(from.y - to.y), 8);

            return (
              <View
                key={`${route.from}-${route.to}`}
                style={[
                  styles.routeLine,
                  {
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  },
                ]}
              />
            );
          })}

          {caseData.locations.map((location) => {
            const isCrime = location.id === caseData.crimeLocationId;
            const isSelected = location.id === selectedLocationId;

            return (
              <TouchableOpacity
                key={location.id}
                activeOpacity={0.82}
                onPress={() => setSelectedLocationId(location.id)}
                style={[
                  styles.location,
                  {
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                  },
                  isCrime && styles.crimeLocation,
                  isSelected && styles.selectedLocation,
                ]}
              >
                <Text style={styles.locationIcon}>{isCrime ? '!' : '•'}</Text>
                <Text style={styles.locationText} numberOfLines={2}>
                  {location.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedLocation && (
          <View style={styles.locationDetails}>
            <Text style={styles.detailsTitle}>{selectedLocation.name}</Text>
            <Text style={styles.detailsText}>{selectedLocation.description}</Text>
          </View>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Маршруты</Text>
      {routeSummaries.map((route) => (
        <Card key={`${route.from}-${route.to}`} style={styles.routeCard}>
          <Text style={styles.routeTitle}>
            {route.from} → {route.to}
          </Text>
          <Text style={styles.routeText}>{route.minutes}</Text>
          {route.restriction ? <Text style={styles.restriction}>Ограничение: {route.restriction}</Text> : null}
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  mapCanvas: {
    height: 320,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSoft,
    overflow: 'hidden',
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    borderTopWidth: 2,
    borderColor: colors.mapRoute,
    opacity: 0.45,
    transform: [{ rotate: '-18deg' }],
  },
  location: {
    position: 'absolute',
    width: 86,
    minHeight: 62,
    marginLeft: -43,
    marginTop: -31,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  selectedLocation: {
    borderColor: colors.primary,
  },
  crimeLocation: {
    backgroundColor: colors.accent,
  },
  locationIcon: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  locationText: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '800',
  },
  locationDetails: {
    marginTop: spacing.md,
  },
  detailsTitle: {
    ...typography.h2,
    color: colors.text,
  },
  detailsText: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  routeCard: {
    padding: spacing.md,
  },
  routeTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '800',
  },
  routeText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  restriction: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.xs,
  },
});
