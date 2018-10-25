import { Unsubscribable } from 'rxjs'
import { QueryTransformerProvider } from 'sourcegraph'
import { SearchAPI } from 'src/client/api/search'
import { ProviderMap } from './common'

/** @internal */
export interface ExtSearchAPI {
    $transformQuery: (id: number, query: string) => Promise<string | null | undefined>
}

/** @internal */
export class ExtSearch implements ExtSearchAPI {
    private registrations = new ProviderMap<QueryTransformerProvider>(id => this.proxy.$unregister(id))
    constructor(private proxy: SearchAPI) {}

    public registerQueryTransformer(provider: QueryTransformerProvider): Unsubscribable {
        const { id, subscription } = this.registrations.add(provider)
        this.proxy.$registerQueryTransformer(id)
        return subscription
    }

    public $transformQuery(id: number, query: string): Promise<string | null | undefined> {
        const provider = this.registrations.get<QueryTransformerProvider>(id)
        return Promise.resolve(provider.transformQuery(query))
    }
}
