import { filter, first } from 'rxjs/operators'
import * as sourcegraph from 'sourcegraph'
import { TextEncoder } from 'util'
import { Controller } from '../client/controller'
import { Environment } from '../client/environment'
import { createExtensionHost } from '../extension/extensionHost'
import { createMessageTransports } from '../protocol/jsonrpc2/helpers.test'

const FIXTURE_ENVIRONMENT: Environment = {
    roots: [{ uri: 'file:///' }],
    visibleTextDocuments: [
        {
            uri: 'file:///f',
            languageId: 'l',
            text: 't',
        },
    ],
    extensions: [{ id: 'x' }],
    configuration: { merged: { a: 1 } },
    context: {},
}

interface TestContext {
    clientController: Controller<any, any>
    extensionHost: typeof sourcegraph
}

/**
 * Set up a new client-extension integration test.
 *
 * @internal
 */
export async function integrationTestContext(): Promise<
    TestContext & {
        getEnvironment: () => Environment
        ready: Promise<void>
    }
> {
    const [clientTransports, serverTransports] = createMessageTransports()

    const clientController = new Controller({
        clientOptions: () => ({ createMessageTransports: () => clientTransports }),
        getFileSystem: () => memoryFileSystem({ 'file:///f': 't' }),
    })
    clientController.setEnvironment(FIXTURE_ENVIRONMENT)

    // Ack all configuration updates.
    clientController.configurationUpdates.subscribe(({ resolve }) => resolve(Promise.resolve()))

    const extensionHost = createExtensionHost(
        { bundleURL: '', sourcegraphURL: 'https://example.com', clientApplication: 'sourcegraph' },
        serverTransports
    )

    // Wait for client to be ready.
    await clientController.clientEntries
        .pipe(
            filter(entries => entries.length > 0),
            first()
        )
        .toPromise()

    return {
        clientController,
        extensionHost,
        getEnvironment(): Environment {
            // This runs synchronously because the Observable's root source is a BehaviorSubject (which has an initial value).
            // Confirm it is synchronous just in case, because a bug here would be hard to diagnose.
            let value!: Environment
            let sync = false
            clientController.environment
                .pipe(first())
                .subscribe(environment => {
                    value = environment
                    sync = true
                })
                .unsubscribe()
            if (!sync) {
                throw new Error('environment is not synchronously available')
            }
            return value
        },
        ready: ready({ clientController, extensionHost }),
    }
}

/**
 * Creates a new implementation of {@link sourcegraph.FileSystem} backed by an object whose keys are URIs and whose
 * values are the file contents.
 *
 * @todo Support nested file systems.
 *
 * @param data An object of URI to file contents. All entries are treated as files, and no hierarchy is supported.
 */
export function memoryFileSystem(data: { [uri: string]: string }): sourcegraph.FileSystem {
    data = data || {}
    return {
        readDirectory: dir =>
            Promise.resolve(
                Object.keys(data).map(
                    // HACK: Can't use sourcegraph.FileType.File value or else it complains "Cannot find module
                    // 'sourcegraph'".
                    uri =>
                        [uri.toString().replace(dir.toString(), ''), 1 as sourcegraph.FileType.File] as [
                            string,
                            sourcegraph.FileType
                        ]
                )
            ),
        readFile: uri => {
            const contents = data[uri.toString()]
            if (contents === undefined) {
                throw new Error(`file not found: ${uri}`)
            }
            return Promise.resolve(new TextEncoder().encode(contents))
        },
    }
}

/** @internal */
async function ready({ extensionHost }: TestContext): Promise<void> {
    await extensionHost.internal.sync()
}

/**
 * Returns a {@link Promise} and a function. The {@link Promise} blocks until the returned function is called.
 *
 * @internal
 */
export function createBarrier(): { wait: Promise<void>; done: () => void } {
    let done!: () => void
    const wait = new Promise<void>(resolve => (done = resolve))
    return { wait, done }
}

export function collectSubscribableValues<T>(subscribable: sourcegraph.Subscribable<T>): T[] {
    const values: T[] = []
    subscribable.subscribe(value => values.push(value))
    return values
}
