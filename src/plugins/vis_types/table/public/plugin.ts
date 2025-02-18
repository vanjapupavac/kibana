/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreSetup, CoreStart, Plugin } from '@kbn/core/public';
import type { Plugin as ExpressionsPublicPlugin } from '@kbn/expressions-plugin/public';
import type { VisualizationsSetup } from '@kbn/visualizations-plugin/public';
import type {
  UsageCollectionSetup,
  UsageCollectionStart,
} from '@kbn/usage-collection-plugin/public';
import type { FieldFormatsStart } from '@kbn/field-formats-plugin/public';

import { setFormatService } from './services';
import { registerTableVis } from './register_vis';

/** @internal */
export interface TablePluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  usageCollection?: UsageCollectionSetup;
}

/** @internal */
export interface TablePluginStartDependencies {
  fieldFormats: FieldFormatsStart;
  usageCollection?: UsageCollectionStart;
}

/** @internal */
export class TableVisPlugin
  implements Plugin<void, void, TablePluginSetupDependencies, TablePluginStartDependencies>
{
  public setup(core: CoreSetup<TablePluginStartDependencies>, deps: TablePluginSetupDependencies) {
    registerTableVis(core, deps);
  }

  public start(core: CoreStart, { fieldFormats }: TablePluginStartDependencies) {
    setFormatService(fieldFormats);
  }
}
