import { ClientCapabilities } from '../../protocol'
import { ClientOptions } from '../client'
import { StaticFeature } from './common'

/**
 * Experimental capabilities implemented by the client (that are not defined
 * by the CXP specification). These capabilities are passed verbatim to
 * extensions in the initialize request's capabilities.experimental
 * property.
 */
export class ExperimentalClientCapabilitiesFeature implements StaticFeature {
    constructor(private experimentalClientCapabilities: ClientOptions['experimentalClientCapabilities']) {}

    public initialize(): void {
        // noop
    }

    public fillClientCapabilities(capabilities: ClientCapabilities): void {
        capabilities.experimental = this.experimentalClientCapabilities
    }
}
