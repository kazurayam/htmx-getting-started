# htmxで作られたWebページをPlaywrightでE2Eテストする方法(ただしnodeではなくbunの上で)

## 背景

わたしは静的HTMLだけでできた旧式なwebサイトの管理運用を職務上担当している。現代的なソフトウェア開発技法を用いてそのサイトを実装し直したいと企んでいる。

いくつか条件がある

1.  TypeScript言語を使う

2.  Node + npm + npxではなくbunを使う

3.  ExpressではなくHonoを使う

4.  クライアント・サイドをできるだけ軽量にしたい。そのためwebページを実装するのにReactではなくHonoのJSXを使ってサーバー・サイド・レンダリング(SSR)する

5.  お知らせ記事をブラウザから投稿してサイトのコンテンツとして追加したい。そのためのUIを実現したい。

記事投稿のUIをSSRだけで実現するのは無理だ。Reactを使うしかないのかなと思い、そのノウハウを教えてくれる本を読んで学んだ。しかしわたしはReactに気乗りがしなかった。わたしが目標とする小さなwebサイトにReactは適合的でないと思った。もっと軽い方法はないものか？と迷っていた。そうこうするうち２０２６年３月、Web記事 [gihyo.jp 「HTMLを拡張し⁠⁠、JSなしで動的UIを作るhtmx」, 嶌田喬行（しまだたかゆき）](https://gihyo.jp/article/2026/02/htmx-introduction) を読んだ。この記事の冒頭にhtmxを使ったwebページのサンプルが紹介されていた。

    <button hx-get="/hello" hx-target="#result">
      読み込み
    </button>
    <div id="result">ここに結果が表示されます</div>

この通りのHTTPサーバアプリをbunとHono JSXで作ってみた。`` my-app`ディレクトリにcdして`bun run dev `` したら `http://localhost:3000` がするりと動いてしまった。とてもいい感じだ。

<figure>
<img src="https://gihyo.jp/assets/images/article/2026/02/htmx-introduction/hello.gif" alt="hello" />
</figure>

よおし、htmxをもっと学ぼうとわたしの気分は高まったが、すぐ一つ課題があることに気づいた。ブラウザ画面上に表示されたボタンを人がマウスでクリックすると「こんにちは」と表示されるのだが、この動きテストしたい。そのテストをコード化して自動化したい。だから

**htmxで作ったHTTPサーバアプリケーションをPlaywrightを使ってE2Eテストしたい、ただしbunとHonoとJSXにhtmxを組み合わせるという条件のもとで。**

こういう課題の解決方法を教えてくれるWeb記事を探したが見当たらなかった。しょうがない。動くコード一式を自作しよう。

## 解決すべき問題

「Playwrightはbunの上ではまともに動かない、PlaywrightはNodeを前提しているから」と述べる記事があった。

- [browserstack, How to Use Bun for Playwright Tests](https://www.browserstack.com/guide/bun-playwright)

本当にそうなのか？わたしはPlaywrightのサンプルコードを打ち込んでbunの上で試してみた。たしかに動かなかった。よくわからないエラーメッセージが表示されて、わたしには手に負えない感じだった。困った。

## 解決方法

"bun playwright"をキーにググったら別のweb記事を見つけた。

- [Running playwright on fly.io with bun, Stephen Haney](https://stephenhaney.com/2024/playwright-on-fly-io-with-bun/)

この記事はテストを実行するのに `npx playwright test` コマンドを使わない。TypeScriptコード `src/main.ts` を書く。その `main.ts` は `playwright-chromium` というJavaScriptライブラリをimportする。そして\`bun run src/main.ts\` というコマンドで実行する。

一方Playwrightの入門記事を読むと `npx playwright test` コマンドを使えと書いてある。たとえば

- [Playwright, Getting Started, Running and debugging tests](https://playwright.dev/docs/running-tests)

Stephen HaneyはPlaywrightの正面玄関ではなく裏口を教えてくれている。`playwright-chromium` ライブラリはPlaywrightプロジェクトが開発したものだ。これを使えばJest流の単体テストがアダプタ層を介してChromiumブラウザを立ち上げ、ブラウザにURLをGETさせて、応答画面のDOMにアクセスできるようにしてくれる。

Browserstackの記事が言うようにPlaywrightプロジェクトがNode依存なところがあるという説はたぶん正しい。しかし `playwright-chromium` ライブラリはたぶんNode依存ではなくて、bunの上でもちゃんと動作するんじゃなかろうか。試してみる価値があると思う。

## 説明

### わたしの環境

- macOS Tahoe 26.3.1 with GNU bash 5.3.3

- \[bun\](<https://bun.com/docs/installation>) 1.3.6

- \[Hono\](<https://hono.dev/docs/getting-started/basic>) ^4.12.5

### サンプルコードのGit Hubレポジトリ
