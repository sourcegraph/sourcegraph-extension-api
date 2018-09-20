import { Unsubscribable } from 'rxjs'
import * as sourcegraph from 'sourcegraph'
import { ClientSearchAPI } from '../../client/api/search'
import { ProviderMap } from './common'

/** @internal */
export interface ExtSearchAPI {
    $transformQuery(id: number, query: string): Promise<string | null | undefined>
}

/** @internal */
export class ExtSearch implements ExtSearchAPI {
    private registrations = new ProviderMap<sourcegraph.SearchOperatorProvider>(id => this.proxy.$unregister(id))

    constructor(private proxy: ClientSearchAPI) {}

    public registerSearchOperatorProvider(name: string, provider: sourcegraph.SearchOperatorProvider): Unsubscribable {
        const { id, subscription } = this.registrations.add(provider)
        this.proxy.$registerSearchOperatorProvider(id, name)
        return subscription
    }

    public $transformQuery(id: number, query: string): Promise<string | null | undefined> {
        const provider = this.registrations.get(id)
        return Promise.resolve(provider.transformQuery ? provider.transformQuery(query) : null)
    }
}
