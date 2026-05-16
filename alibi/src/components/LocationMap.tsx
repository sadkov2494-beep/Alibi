import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';
import { CaseData, Route } from '../types';
import { transportLabels } from '../utils/format';
import { Card } from './Card';

interface LocationMapProps {
  caseData: CaseData;
}

const routeColors = ['#F7B731', '#7D5FFF', '#FF6B6B', '#4CD964', '#FAD390', '#65C9FF', '#FFB020', '#C56CF0'];

const formatDistance = (distanceMeters: number) => {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(distanceMeters % 1000 === 0 ? 0 : 1)} км`;
  }

  return `${distanceMeters} м`;
};

const getRouteTimes = (route: Route) =>
  [
    route.walkMinutes ? `${transportLabels.walk}: ${route.walkMinutes} мин` : null,
    route.carMinutes ? `${transportLabels.car}: ${route.carMinutes} мин` : null,
    route.busMinutes ? `${transportLabels.bus}: ${route.busMinutes} мин` : null,
    route.metroMinutes ? `${transportLabels.metro}: ${route.metroMinutes} мин` : null,
    route.taxiMinutes ? `${transportLabels.taxi}: ${route.taxiMinutes} мин` : null,
  ].filter(Boolean) as string[];

export const LocationMap = ({ caseData }: LocationMapProps) => {
  const [selectedLocationId, setSelectedLocationId] = useState(caseData.crimeLocationId);
  const selectedLocation = caseData.locations.find((location) => location.id === selectedLocationId);

  const routeSummaries = useMemo(
    () =>
      caseData.routes.map((route) => {
        const from = caseData.locations.find((location) => location.id === route.from)?.name ?? route.from;
        const to = caseData.locations.find((location) => location.id === route.to)?.name ?? route.to;
        const minutes = getRouteTimes(route).join(' · ');

        return { ...route, from, to, minutes };
      }),
    [caseData.locations, caseData.routes],
  );

  return (
    <View style={styles.wrap}>
      <Card>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>Схема района</Text>
          <Text style={styles.mapLegend}>Линии показывают расстояние и доступное время пути</Text>
        </View>

        <View style={styles.mapCanvas}>
          <View style={styles.mapGridHorizontal} />
          <View style={styles.mapGridVertical} />

          {caseData.routes.map((route, index) => {
            const from = caseData.locations.find((location) => location.id === route.from);
            const to = caseData.locations.find((location) => location.id === route.to);

            if (!from || !to) {
              return null;
            }

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.max(Math.sqrt(dx * dx + dy * dy), 8);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const middleX = (from.x + to.x) / 2;
            const middleY = (from.y + to.y) / 2;
            const color = routeColors[index % routeColors.length];

            return (
              <View key={`${route.from}-${route.to}`}>
                <View
                  pointerEvents="none"
                  style={[
                    styles.routeLine,
                    {
                      left: `${middleX - length / 2}%`,
                      top: `${middleY}%`,
                      width: `${length}%`,
                      borderColor: color,
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.routeNumber,
                    {
                      left: `${Math.max(5, Math.min(91, middleX))}%`,
                      top: `${Math.max(5, Math.min(91, middleY))}%`,
                      backgroundColor: color,
                    },
                  ]}
                >
                  <Text style={styles.routeNumberText}>{index + 1}</Text>
                </View>
              </View>
            );
          })}

          {caseData.mapDecorations?.map((decoration) => (
            <View
              key={decoration.id}
              style={[
                styles.decoration,
                {
                  left: `${decoration.x}%`,
                  top: `${decoration.y}%`,
                },
              ]}
            >
              <Text style={styles.decorationIcon}>{decoration.icon}</Text>
            </View>
          ))}

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
      {routeSummaries.map((route, index) => (
        <Card key={`${route.from}-${route.to}`} style={styles.routeCard}>
          <View style={styles.routeCardHeader}>
            <View style={[styles.routeCardBadge, { backgroundColor: routeColors[index % routeColors.length] }]}>
              <Text style={styles.routeCardBadgeText}>{index + 1}</Text>
            </View>
            <View style={styles.routeCardText}>
              <Text style={styles.routeTitle}>
                {route.from} → {route.to}
              </Text>
              <Text style={styles.routeDistance}>{formatDistance(route.distanceMeters)}</Text>
            </View>
          </View>
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
    height: 380,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSoft,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.line,
  },
  mapHeader: {
    marginBottom: spacing.md,
  },
  mapTitle: {
    ...typography.h2,
    color: colors.text,
  },
  mapLegend: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
  mapGridHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: colors.line,
    opacity: 0.35,
  },
  mapGridVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: colors.line,
    opacity: 0.35,
  },
  routeLine: {
    position: 'absolute',
    borderTopWidth: 4,
    borderColor: colors.mapRoute,
    opacity: 0.78,
    transformOrigin: 'center',
    zIndex: 1,
  },
  routeNumber: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  routeNumberText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '900',
  },
  decoration: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    opacity: 0.78,
    zIndex: 3,
  },
  decorationIcon: {
    fontSize: 17,
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
    zIndex: 4,
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
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  routeCardBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeCardBadgeText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '900',
  },
  routeCardText: {
    flex: 1,
  },
  routeTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '800',
  },
  routeDistance: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: spacing.xs,
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
