import { Subscription } from 'rxjs'
import { createProxyAndHandleRequests } from '../../common/proxy'
import { ExtSearchAPI } from '../../extension/api/search'
import { Connection } from '../../protocol/jsonrpc2/connection'
import { SearchOperatorRegistry } from '../providers/searchOperator'
import { SubscriptionMap } from './common'

/** @internal */
export interface ClientSearchAPI {
    $unregister(id: number): void
    $registerSearchOperatorProvider(id: number, name: string): void
}

/** @internal */
export class ClientSearch implements ClientSearchAPI {
    private subscriptions = new Subscription()
    private registrations = new SubscriptionMap()
    private proxy: ExtSearchAPI

    constructor(connection: Connection, private searchOperatorRegistry: SearchOperatorRegistry) {
        this.subscriptions.add(this.registrations)

        this.proxy = createProxyAndHandleRequests('search', connection, this)
    }

    public $unregister(id: number): void {
        this.registrations.remove(id)
    }

    public $registerSearchOperatorProvider(id: number, name: string): void {
        this.registrations.add(
            id,
            this.searchOperatorRegistry.registerProvider({
                name,
                provider: {
                    transformQuery: query => this.proxy.$transformQuery(id, query),
                },
            })
        )
    }

    public unsubscribe(): void {
        this.subscriptions.unsubscribe()
    }
}
