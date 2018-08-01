# CXP Hello World tutorial

Create a new npm project and install the `cxp` package:

```
mkdir cxp-hello-world
cd cxp-hello-world
npm init -y
npm install cxp
```

Create `hello.ts`, which colors the first few lines of a file different colors:

```typescript
// hello.ts
import { createWebWorkerMessageTransports, Worker } from '../../src/jsonrpc2/transports/webWorker'
import { InitializeResult } from '../../src/protocol'
import { TextDocumentDecoration, TextDocumentDecorationParams } from '../../src/protocol/decoration'
import { Connection, createConnection } from '../../src/server/server'

declare var self: Worker

function register(connection: Connection): void {
  connection.onInitialize(
    params =>
      ({
        capabilities: { decorationProvider: { static: true } },
      } as InitializeResult)
  )

  connection.onRequest(
    'textDocument/decoration',
    (params: TextDocumentDecorationParams): TextDocumentDecoration[] =>
      ['cyan', 'magenta', 'yellow'].map(
        (color, i) =>
          ({
            range: { start: { line: i, character: 0 }, end: { line: i, character: 0 } },
            isWholeLine: true,
            backgroundColor: color,
          } as TextDocumentDecoration)
      )
  )
}

const connection = createConnection(createWebWorkerMessageTransports(self))
register(connection)
connection.listen()
```

Serve your extension over HTTP:

```
npx parcel --no-hmr -p 1234 watch hello.ts
```

_You can also serve it with `ngrok` and share it with other people_

Publish your extension to the registry:

- Visit the registry: https://sourcegraph.com/registry
- Click “Create new extension”
- Enter a name
- Click on the Edit tab
- Change it to `”type”: “bundle”` and switch `address` to `”url”: “http://localhost:1234/hello.js”`
- Click “Update extension”

Add your new extension to your account by clicking “Enable extension”.

Install Sourcegraph Beta for Chrome https://chrome.google.com/webstore/detail/sourcegraph-beta/jdddnfddjbgmnbanfenikllpelfinill

Click the popover and click “Enable CXP”.

Open https://github.com/gorilla/mux/blob/master/mux.go and you should see a few colored lines 🎉

## Changing the colors

Now change a color and refresh the page.

```diff
-            ['cyan', 'magenta', 'yellow'].map(
+            ['orange, 'magenta', 'yellow'].map(
```

## Other CXP capabilities

You can do all sorts of things with CXP!

**Get the file content**

**Line annotations**

```typescript
```

**Buttons**
