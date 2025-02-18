/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import moment from 'moment/moment';
import React, { FC } from 'react';
import { BehaviorSubject } from 'rxjs';
import { I18nProvider } from '@kbn/i18n-react';
import { coreMock } from '@kbn/core/public/mocks';
import { dataPluginMock } from '@kbn/data-plugin/public/mocks';
import type { IStorage } from '@kbn/kibana-utils-plugin/public';
import { Storage } from '@kbn/kibana-utils-plugin/public';
import { unifiedSearchPluginMock } from '@kbn/unified-search-plugin/public/mocks';
import { createTGridMocks } from '@kbn/timelines-plugin/public/mock';
import { KibanaContext } from '../../hooks/use_kibana';
import { SecuritySolutionPluginContext } from '../../types';
import { getSecuritySolutionContextMock } from './mock_security_context';
import { mockUiSetting } from './mock_kibana_ui_settings_service';
import { SecuritySolutionContext } from '../../containers/security_solution_context';

export const localStorageMock = (): IStorage => {
  let store: Record<string, unknown> = {};

  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: unknown) => {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
};

export const createTiStorageMock = () => {
  const localStorage = localStorageMock();
  return {
    localStorage,
    storage: new Storage(localStorage),
  };
};

const { storage } = createTiStorageMock();

export const unifiedSearch = unifiedSearchPluginMock.createStartContract();

const validDate: string = '1 Jan 2022 00:00:00 GMT';
const data = dataPluginMock.createStartContract();

const dataServiceMock = {
  ...data,
  query: {
    ...data.query,
    savedQueries: {
      ...data.query.savedQueries,
      getAllSavedQueries: jest.fn(() =>
        Promise.resolve({
          id: '123',
          attributes: {
            total: 123,
          },
        })
      ),
      findSavedQueries: jest.fn(() =>
        Promise.resolve({
          total: 123,
          queries: [],
        })
      ),
    },
    timefilter: {
      timefilter: {
        calculateBounds: jest.fn().mockImplementation(() => ({
          min: moment(validDate),
          max: moment(validDate).add(1, 'days'),
        })),
      },
    },
  },
  search: {
    ...data.search,
    search: jest.fn().mockReturnValue(new BehaviorSubject({})),
  },
};

const timelinesServiceMock = createTGridMocks();

const core = coreMock.createStart();
const coreServiceMock = {
  ...core,
  uiSettings: { get: jest.fn().mockImplementation(mockUiSetting) },
};

const mockSecurityContext: SecuritySolutionPluginContext = getSecuritySolutionContextMock();

export const mockedServices = {
  ...coreServiceMock,
  data: dataServiceMock,
  storage,
  unifiedSearch,
  triggersActionsUi: {
    getFieldBrowser: jest.fn().mockReturnValue(null),
  },
  timelines: timelinesServiceMock,
};

export const TestProvidersComponent: FC = ({ children }) => (
  <SecuritySolutionContext.Provider value={mockSecurityContext}>
    <KibanaContext.Provider value={{ services: mockedServices } as any}>
      <I18nProvider>{children}</I18nProvider>
    </KibanaContext.Provider>
  </SecuritySolutionContext.Provider>
);

export type MockedSearch = jest.Mocked<typeof mockedServices.data.search>;
export type MockedTimefilter = jest.Mocked<typeof mockedServices.data.query.timefilter>;
export type MockedTriggersActionsUi = jest.Mocked<typeof mockedServices.triggersActionsUi>;

export const mockedSearchService = mockedServices.data.search as MockedSearch;
export const mockedTimefilterService = mockedServices.data.query.timefilter as MockedTimefilter;
export const mockedTriggersActionsUiService =
  mockedServices.triggersActionsUi as MockedTriggersActionsUi;
