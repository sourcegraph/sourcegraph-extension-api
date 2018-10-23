import { Unsubscribable } from 'rxjs'
import { SearchProvider } from 'sourcegraph'
import { SearchFeaturesAPI } from 'src/client/api/search'
import { ProviderMap } from './common'

/** @internal */
export interface ExtSearchFeaturesAPI {
    $transformQuery: (id: number, query: string) => Promise<string | null | undefined>
}

/** @internal */
export class ExtSearchFeatures implements ExtSearchFeaturesAPI {
    private registrations = new ProviderMap<SearchProvider>(id => this.proxy.$unregister(id))
    constructor(private proxy: SearchFeaturesAPI) {}

    public registerSearchProvider(provider: SearchProvider): Unsubscribable {
        const { id, subscription } = this.registrations.add(provider)
        this.proxy.$registerSearchProvider(id)
        return subscription
    }

    public $transformQuery(id: number, query: string): Promise<string | null | undefined> {
        const provider = this.registrations.get<SearchProvider>(id)
        return Promise.resolve(provider.transformQuery(query))
    }
}
