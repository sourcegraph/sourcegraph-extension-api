import { Observable, of } from 'rxjs'
import { flatMap, map, switchMap } from 'rxjs/operators'
import { FeatureProviderRegistry } from './registry'

export type TransformQuerySignature = (query: string) => Observable<string | null | undefined>

/** Provides transformed queries from the first search extension. */
export class QueryTransformerRegistry extends FeatureProviderRegistry<{}, TransformQuerySignature> {
    public transformQuery(query: string): Observable<string | null | undefined> {
        return transformQuery(this.providers, query)
    }
}

/**
 * Returns an observable that emits all provider's transformed query whenever any of the last-emitted set of providers emits
 * a query.
 *
 * Most callers should use QueryTransformerRegistry's transformQuery method, which uses the registered search
 * providers.
 */
export function transformQuery(
    providers: Observable<TransformQuerySignature[]>,
    query: string
): Observable<string | null | undefined> {
    return providers.pipe(
        switchMap(providers => {
            if (providers.length === 0) {
                return [query]
            }
            // let currentQuery = providers[0](query).pipe(map(q => q))
            // for (const provider of providers) {
            //     const str = currentQuery.subscribe()
            //     currentQuery = provider()
            // }
            return providers.reduce(
                (currentQuery, transformQuery) =>
                    currentQuery.pipe(
                        flatMap(q => transformQuery(q).pipe(map(transformedQuery => transformedQuery || q)))
                    ),
                of(query)
            )
            // of(providers).pipe(reduce((accumulatedValue, currentProvider) => currentProvider(accumulatedValue)), providers[0](query)))
        })
    )
}
