import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { FeatureProviderRegistry } from './registry'

export type TransformQuerySignature = (query: string) => Observable<string | null | undefined>
/** Provides hovers from all extensions. */
export class SearchTransformProviderRegistry extends FeatureProviderRegistry<{}, TransformQuerySignature> {
    public transformQuery(query: string): Observable<string | null | undefined> {
        return transformQuery(this.providers, query)
    }
}

/**
 * Returns an observable that emits all providers' hovers whenever any of the last-emitted set of providers emits
 * hovers.
 *
 * Most callers should use TextDocumentHoverProviderRegistry's getHover method, which uses the registered hover
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
            return providers[0](query)
        })
    )
}
