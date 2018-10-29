import { Subscription } from 'rxjs'
import * as sourcegraph from 'sourcegraph'
import { handleRequests } from '../../common/proxy'
import { Connection } from '../../protocol/jsonrpc2/connection'

/** @internal */
export interface ClientStorageAPI {
    $get(type: string, key: string): Promise<any>
    $set(type: string, key: string, value: any): Promise<void>
}

/** @internal */
export class ClientStorage implements ClientStorageAPI {
    private subscriptions = new Subscription()

    constructor(connection: Connection, private updateStorage: (updates: StorageValues) => void) {
        handleRequests(connection, 'storage', this)
    }

    // TODO!(sqs): finish implementing these
    public $get(type: string, key: string): Promise<any> {}

    public $set(type: string, key: string, value: any): Promise<void> {
        for (const key of Object.keys(updates)) {
            this.keys.add(key)
        }
        this.updateStorage(updates)
    }
}
