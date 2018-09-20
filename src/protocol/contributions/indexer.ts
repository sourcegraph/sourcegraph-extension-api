/**
 * The indexers (of various types) that are contributed by the extension.
 *
 * Indexers are invoked non-interactively. The data that they produce is persisted for later querying and
 * retrieval.
 */
export interface IndexerContributions {
    /**
     * Dependencies indexers contributed by the extension.
     *
     * @see {@link DependenciesIndexerContribution}
     */
    dependencies?: DependenciesIndexerContribution[]
}

/**
 * A dependencies indexer produces a data structure enumerating the current workspace's dependencies (e.g., npm
 * package.json dependencies and devDependencies, Python requirements.txt dependencies, etc.).
 */
export interface DependenciesIndexerContribution {
    /**
     * An identifier for this indexer. When the extension is activated, it must call {@link module:sourcegraph.languages.registerDependenciesIndexer}
     */
    id: string
}
