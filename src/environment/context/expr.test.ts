import assert from 'assert'
import { contextFilter, parseContextExpr } from './expr'

const FIXTURE_CONTEXT = new Map<string, any>(
    Object.entries({
        a: 1,
        b: 1,
        c: 2,
    })
)

describe('ContextExpr', () => {
    it('evaluates', () => {
        const EXPR_RESULTS: { [expr: string]: any } = {
            a: 1,
            c: 2,
            'a == b': true,
            'a == c': false,
            d: undefined,
            'd == e': true,
            'a == d': false,
            'a == a': true,
            'a == b == c': false,
        }
        for (const [expr, want] of Object.entries(EXPR_RESULTS)) {
            assert.strictEqual(parseContextExpr(expr).eval(FIXTURE_CONTEXT), want, expr)
        }
    })

    it('parses and serializes', () => {
        const EXPR_RESULTS: { [expr: string]: string } = {
            a: 'a',
            ' a ': 'a',
            'a == b': 'a == b',
            'a==b': 'a == b',
            'a == b == c': 'a == b == c',
        }
        for (const [expr, want] of Object.entries(EXPR_RESULTS)) {
            assert.strictEqual(parseContextExpr(expr).serialize(), want)
        }
    })
})

describe('parseContextExpr', () => {
    it('parses', () => assert.doesNotThrow(() => parseContextExpr('a')))
})

describe('contextFilter', () => {
    it('filters', () =>
        assert.deepStrictEqual(
            contextFilter(FIXTURE_CONTEXT, [
                { x: 1 },
                { x: 2, when: 'a' },
                { x: 3, when: 'a == b' },
                { x: 4, when: 'a == c' },
            ]),
            [{ x: 1 }, { x: 2, when: 'a' }, { x: 3, when: 'a == b' }]
        ))
})
