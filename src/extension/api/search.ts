import { Unsubscribable } from 'rxjs'
import { QueryTransformProvider } from 'sourcegraph'
import { SearchFeaturesAPI } from 'src/client/api/search'
import { ProviderMap } from './common'

/** @internal */
export interface ExtSearchFeaturesAPI {
    $transformQuery: (id: number, query: string) => Promise<string | null | undefined>
}

/** @internal */
export class ExtSearchFeatures implements ExtSearchFeaturesAPI {
    private registrations = new ProviderMap<QueryTransformProvider>(id => this.proxy.$unregister(id))
    constructor(private proxy: SearchFeaturesAPI) {}

    public registerQueryTransformProvider(provider: QueryTransformProvider): Unsubscribable {
        const { id, subscription } = this.registrations.add(provider)
        this.proxy.$registerQueryTransformProvider(id)
        return subscription
    }

    public $transformQuery(id: number, query: string): Promise<string | null | undefined> {
        const provider = this.registrations.get<QueryTransformProvider>(id)
        return Promise.resolve(provider.transformQuery(query))
    }
}
