import { ClientCapabilities } from '../../protocol'
import { XContentRequest, XFilesRequest } from '../../protocol/extension-files'
import { _RemoteWorkspace } from '../../server/features/workspace'
import { Client } from '../client'
import { StaticFeature } from './common'

export class FilesExtensionFeature implements StaticFeature {
    constructor(private client: Client) {}

    public fillClientCapabilities(capabilities: ClientCapabilities): void {
        capabilities.files = capabilities.files || false
    }

    public initialize(): void {
        if (!this.client.options.files) {
            return
        }
        this.client.onRequest(XFilesRequest.type, (params, token) => this.client.options.files!.xfiles(params))
        this.client.onRequest(XContentRequest.type, (params, token) => this.client.options.files!.xcontent(params))
    }
}
