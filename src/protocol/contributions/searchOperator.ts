/**
 * A custom search query operator contributed by the extension.
 *
 * This contribution lets extensions define new search query operators (beyond the builtin operators like "file:"
 * and "repo:").
 *
 * This contribution causes the extension to be invoked non-interactively when the query itself is non-interactive.
 */
export interface SearchOperatorContribution {
    /**
     * The operator name that is used in search queries to invoke this contribution. Do not include the trailing
     * colon (":").
     *
     * When the extension is activated, it must call {@link module:sourcegraph.search.registerQueryOperator} and
     * use the same name as the one given here.
     *
     * @example "foo", to define a custom operator "foo" that is used in the query "baz foo:bar qux".
     */
    name: string

    /**
     * A description of what this operator does.
     *
     * @example "Matches JavaScript/TypeScript files that require or import the given module."
     */
    description?: string

    /**
     * An expression that, if given, must evaluate to true (or a truthy value) for this contribution to be enabled.
     * The expression may use values from the context in which the contribution would be invoked.
     */
    when?: string

    // TODO!(sqs): data type, aliases, negatability, quote type, etc.
}
