/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '@kbn/core/public';
import { PLUGIN_ID, PLUGIN_NAME, exampleFileKind } from '../common';
import { FilesExamplePluginsStart, FilesExamplePluginsSetup } from './types';

export class FilesExamplePlugin
  implements Plugin<unknown, unknown, FilesExamplePluginsSetup, FilesExamplePluginsStart>
{
  public setup(core: CoreSetup<FilesExamplePluginsStart>) {
    // Register an application into the side navigation menu
    core.application.register({
      id: PLUGIN_ID,
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, { files }] = await core.getStartServices();
        // Render the application
        return renderApp(
          coreStart,
          {
            files: {
              example: files.filesClientFactory.asScoped(exampleFileKind.id),
            },
          },
          params
        );
      },
    });

    // Return methods that should be available to other plugins
    return {};
  }

  public start(core: CoreStart) {
    return {};
  }

  public stop() {}
}
