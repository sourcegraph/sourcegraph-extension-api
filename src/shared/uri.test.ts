import assert from 'assert'
import { URI, URIComponents } from './uri'

function assertParsedURI(uriStr: string, expected: Partial<URIComponents>, expectedStr = uriStr): void {
    expected.scheme = expected.scheme || ''
    expected.authority = expected.authority || ''
    expected.path = expected.path || ''
    expected.query = expected.query || ''
    expected.fragment = expected.fragment || ''

    const uri = URI.parse(uriStr)
    assert.deepStrictEqual(uri.toJSON(), expected, `URI.parse(${JSON.stringify(uriStr)})`)

    assert.strictEqual(uri.toString(), expectedStr, `URI#toString ${JSON.stringify(uri.toJSON())}`)
}

describe('URI', () => {
    it('parses and produces string representation', () => {
        // A '/' is automatically added to the path for special schemes by WHATWG URL. This is undesirable but
        // harmless.
        assertParsedURI(
            'https://example.com',
            {
                scheme: 'https',
                authority: 'example.com',
                path: '/',
            },
            'https://example.com/'
        )
        assertParsedURI(
            'foo://example.com',
            {
                scheme: 'foo',
                authority: 'example.com',
            },
            'foo://example.com'
        )
        assertParsedURI('https://example.com/a', {
            scheme: 'https',
            authority: 'example.com',
            path: '/a',
        })
        assertParsedURI('foo://example.com/a', {
            scheme: 'foo',
            authority: 'example.com',
            path: '/a',
        })
        assertParsedURI('https://u:p@example.com:1234/a/b?c=d#e', {
            scheme: 'https',
            authority: 'u:p@example.com:1234',
            path: '/a/b',
            query: 'c=d',
            fragment: 'e',
        })
        assertParsedURI('file:///a', {
            scheme: 'file',
            path: '/a',
        })
    })

    it('with', () =>
        assert.strictEqual(
            URI.parse('https://example.com/a')
                .with({ path: '/b', query: 'c' })
                .toString(),
            'https://example.com/b?c'
        ))
})
