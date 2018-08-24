import * as assert from 'assert'
import { ClientCapabilities } from '../../protocol'
import { ExperimentalClientCapabilitiesFeature } from './experimentalClientCapabilities'

describe('ExperimentalClientCapabilitiesFeature', () => {
    it('sets experimental client capabilities', () => {
        const capabilities: ClientCapabilities = {}
        new ExperimentalClientCapabilitiesFeature({ capabilityFoo: true }).fillClientCapabilities(capabilities)
        assert.deepStrictEqual(capabilities, {
            experimental: {
                capabilityFoo: true,
            },
        } as ClientCapabilities)
    })
})
