import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

app.get('/', (c) => {
    return c.html(
        html`<!doctype html>
        <html>
            <head>
                <title>Welcome nobody</title>
            </head>
            <body>
                <p>Hello Hono!</p>
            </body>
        </html>
        `
    )
})

export default app
