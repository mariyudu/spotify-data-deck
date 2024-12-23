# Spotify Data Deck

Spotify API 経由でアルバムやトラックの情報を取得するだけのカンタンな Vue.js 製ウェブアプリです。

## 概要

* Vue3 + Tailwind CSS + daisyUI で書かれた、バックエンド不要のフロントエンド 100% な SPA。
* Spotify API の認証認可は、OAuth2 PKCE フローを利用。
* 必要な設定項目は API クライアント ID のみで、ブラウザのローカルストレージに保存。

## 使い方

1. Spotify デベロッパーサイトのダッシュボードから、アプリケーションを登録して API クライアント ID を取得。アプリケーションのコールバック URI には http://localhost:3000/api-callback/ を設定しておく。
2. 手元の開発環境にて本リポジトリを clone して、npm install および npm run dev でアプリを起動。
3. 検索窓に、データ取得したい Spotify のアルバムかトラックの URL を入力して Search ボタンをクリック。
4. Spotify API クライアント ID が未設定の場合は、ダイアログボックスで入力を要求してくるので、これを設定。
5. 検索窓の下に検索結果が表示される。
