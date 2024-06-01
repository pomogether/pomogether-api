import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'
import app from '@adonisjs/core/services/app'
import { TestContext } from '@japa/runner/core'
import { Faker, faker } from '@faker-js/faker'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

declare module '@japa/runner/core' {
  interface TestContext {
    faker: Faker
  }
}
TestContext.macro('faker', faker)

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [assert(), apiClient(), pluginAdonisJS(app)]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executer after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'integration', 'e2e'].includes(suite.name)) {
    suite.setup(() => testUtils.httpServer().start())
    suite.setup(() => testUtils.db().truncate())
  }

  return suite
}
