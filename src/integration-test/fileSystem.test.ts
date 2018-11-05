import * as assert from 'assert'
import * as sourcegraph from 'sourcegraph'
import { URI } from '../shared/uri'
import { tryCatchPromise } from '../util'
import { integrationTestContext } from './helpers.test'

describe('File system (integration)', () => {
    describe('workspace.fileSystem', () => {
        it('readDirectory', async () => {
            const { extensionHost, ready } = await integrationTestContext()

            await ready
            assert.deepStrictEqual(await extensionHost.workspace.fileSystem.readDirectory(URI.parse('file:///')), [
                ['f', 1 as sourcegraph.FileType.File],
            ] as [string, sourcegraph.FileType][])
        })

        it('readFile', async () => {
            const { extensionHost, ready } = await integrationTestContext()

            await ready
            assert.deepStrictEqual(
                await extensionHost.workspace.fileSystem.readFile(URI.parse('file:///f')),
                new Uint8Array([116]) as Uint8Array
            )
            // tslint:disable-next-line:no-floating-promises
            assert.rejects(
                tryCatchPromise(() => extensionHost.workspace.fileSystem.readFile(URI.parse('file:///does-not-exist')))
            )
        })
    })
})
