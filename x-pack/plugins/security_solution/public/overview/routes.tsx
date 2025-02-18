/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { TrackApplicationView } from '@kbn/usage-collection-plugin/public';
import {
  LANDING_PATH,
  OVERVIEW_PATH,
  DETECTION_RESPONSE_PATH,
  SecurityPageName,
  ENTITY_ANALYTICS_PATH,
} from '../../common/constants';
import type { SecuritySubPluginRoutes } from '../app/types';

import { LandingPage } from './pages/landing';
import { StatefulOverview } from './pages/overview';
import { DetectionResponse } from './pages/detection_response';
import { EntityAnalyticsPage } from './pages/entity_analytics';

const OverviewRoutes = () => (
  <TrackApplicationView viewId={SecurityPageName.overview}>
    <StatefulOverview />
  </TrackApplicationView>
);

const DetectionResponseRoutes = () => (
  <TrackApplicationView viewId={SecurityPageName.detectionAndResponse}>
    <DetectionResponse />
  </TrackApplicationView>
);

const LandingRoutes = () => (
  <TrackApplicationView viewId={SecurityPageName.landing}>
    <LandingPage />
  </TrackApplicationView>
);

const EntityAnalyticsRoutes = () => (
  <TrackApplicationView viewId={SecurityPageName.entityAnalytics}>
    <EntityAnalyticsPage />
  </TrackApplicationView>
);

export const routes: SecuritySubPluginRoutes = [
  {
    path: OVERVIEW_PATH,
    render: OverviewRoutes,
  },
  {
    path: DETECTION_RESPONSE_PATH,
    render: DetectionResponseRoutes,
  },
  {
    path: LANDING_PATH,
    render: LandingRoutes,
  },
  {
    path: ENTITY_ANALYTICS_PATH,
    render: EntityAnalyticsRoutes,
  },
];
