import { from, Observable, Subscription } from 'rxjs'
import { ExtSearch } from 'src/extension/api/search'
import { Connection } from 'src/protocol/jsonrpc2/connection'
import { createProxyAndHandleRequests } from '../../common/proxy'
import { TransformQuerySignature } from '../providers/queryTransformer'
import { FeatureProviderRegistry } from '../providers/registry'
import { SubscriptionMap } from './common'

export interface SearchAPI {
    $registerQueryTransformer(id: number): void
    $unregister(id: number): void
}

export class Search implements SearchAPI {
    private subscriptions = new Subscription()
    private registrations = new SubscriptionMap()
    private proxy: ExtSearch

    constructor(connection: Connection, private searchRegistry: FeatureProviderRegistry<{}, TransformQuerySignature>) {
        this.subscriptions.add(this.registrations)

        this.proxy = createProxyAndHandleRequests('searchFeatures', connection, this)
    }

    public $registerQueryTransformer(id: number): void {
        this.registrations.add(
            id,
            this.searchRegistry.registerProvider(
                {},
                (query: string): Observable<string | null | undefined> => from(this.proxy.$transformQuery(id, query))
            )
        )
    }

    public $unregister(id: number): void {
        this.registrations.remove(id)
    }

    public unsubscribe(): void {
        this.subscriptions.unsubscribe()
    }
}
