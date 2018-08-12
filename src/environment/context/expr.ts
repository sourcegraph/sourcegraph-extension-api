/**
 * Context is an arbitrary set of key-value pairs.
 */
export interface Context {
    get(key: string): any
}

/** A Context that is empty (and returns undefined for every key). */
export const EMPTY_CONTEXT: Context = {
    get(): any {
        return undefined
    },
}

/**
 * A context expression is a simple expression that is evaluated using values from Context.
 */
export interface ContextExpr {
    /** Evaluates the expression using the context's values. */
    eval(context: Context): any

    /**
     * Returns the string form of this expression, which results in an equivalent expression when passed to
     * parseContextExpr.
     */
    serialize(): string
}

class KeyExpr implements ContextExpr {
    constructor(private key: string) {}

    public eval(context: Context): any {
        return context.get(this.key)
    }

    public serialize(): string {
        return this.key
    }
}

class EqualsExpr implements ContextExpr {
    constructor(private left: ContextExpr, private right: ContextExpr) {}

    public eval(context: Context): boolean {
        // Intentionally use == because its behavior is useful in context expressions.
        //
        // tslint:disable-next-line:triple-equals
        return this.left.eval(context) == this.right.eval(context)
    }

    public serialize(): string {
        return `${this.left.serialize()} == ${this.right.serialize()}`
    }
}

/** Parse a context expression. */
export function parseContextExpr(expr: string): ContextExpr {
    const parts = expr.split('==').map(e => e.trim())
    if (parts.length > 1) {
        return new EqualsExpr(parseContextExpr(parts[0]), parseContextExpr(parts.slice(1).join('==')))
    }
    return new KeyExpr(parts[0].trim())
}

/** Filters out items whose `when` context expression evaluates to false (or a falsey value). */
export function contextFilter<T extends { when?: string }>(context: Context, items: T[]): T[] {
    const keep: T[] = []
    for (const item of items) {
        if (item.when !== undefined) {
            const expr = parseContextExpr(item.when)
            if (!expr.eval(context)) {
                continue // omit
            }
        }
        keep.push(item)
    }
    return keep
}
