import { BehaviorSubject, Observable, Unsubscribable } from 'rxjs'
import * as sourcegraph from 'sourcegraph'

/** A registered search operator in {@link SearchOperatorRegistry}. */
export interface SearchOperatorEntry {
    /** The name of the search operator. */
    name: string

    /** The search operator provider. */
    provider: sourcegraph.SearchOperatorProvider
}

/** Manages and executes search operators from all extensions. */
export class SearchOperatorRegistry {
    private entries = new BehaviorSubject<SearchOperatorEntry[]>([])

    public registerProvider(entry: SearchOperatorEntry): Unsubscribable {
        this.entries.next([...this.entries.value, entry])
        return {
            unsubscribe: () => {
                this.entries.next(this.entries.value.filter(e => e !== entry))
            },
        }
    }

    /**
     * Transforms the query using the registered search operator providers.
     */
    public transformQuery(query: string): Promise<string> {
        return transformQuery(this.entries.value, query)
    }

    /** All search operator providers, emitted whenever the set of registered providers changes. */
    public readonly commands: Observable<SearchOperatorEntry[]> = this.entries
}

/**
 * Transforms the query using the specified search operator provider entries.
 *
 * Most callers should use {@link SearchOperatorRegistry#getHover}, which uses the registered search operator
 * providers.
 *
 * @see {@link module:sourcegraph.SearchOperatorProvider#transformQuery}
 */
export async function transformQuery(entries: SearchOperatorEntry[], query: string): Promise<string> {
    for (const { name, provider } of entries) {
        // TODO!(sqs): support operator aliases
        if (query.includes(`${name}:`)) {
            if (provider.transformQuery) {
                const transformedQuery = await provider.transformQuery(query)
                if (typeof transformedQuery === 'string') {
                    query = transformedQuery
                }
            }
        }
    }
    return query
}
