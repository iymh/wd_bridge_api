# Watson Discovery Build Assets

## CodeEngine環境
<div>
  <img src="./chart-wd_bridge_2.jpg" width="80%">
</div>

### Webアプリの概要
* コンテナ化されたNode.jsで実装したWebサーバ
  * ExpressでRESTサーバ実装
  * DiscoveryV2APIでWatsonDiscoveryからデータ取得
  * 簡易的な認証(BasicAuth)を実装(テスト実装)
  * 環境変数でパラメータ値が必要
    * API_KEY: WatsonDiscoveryのAPI鍵
    * API_BASE_URL: WatsonDiscoveryのエンドポイントURL

### 設定
  * CodeEngineにプロジェクトを作成してアプリケーション一覧を表示する
    <div>
      <img src="./ce1.png" width="80%">
    </div>
  * アプリケーションの情報を入力する
    * "名前"
    * "実行するコードの選択" > "ソース・コード"
      * "ソース・コードURL" > "https://github.com/iymh/wd_bridge_api"
    * "ビルド詳細の設定"ボタンを押す
    <div>
      <img src="./ce2.png" width="80%">
    </div>
  * ビルド情報を入力する
    * "Dockerfile" > Dockerfile
      * "Buildpack"でも可能だがコンテナサイズが肥大化してしまう
    * "レジストリー・サーバー" > "private.jp.icr.io"
    * "名前空間" > Container Registryリソースを作成しておく
    <div>
      <img src="./ce3.png" width="30%">
      <img src="./ce4.png" width="30%">
      <img src="./ce5.png" width="30%">
    </div>

  * ビルド情報が反映されていることを確認
    * "リスニング・ポート" > "3000"
      * ".env"ファイル内で指定したPort番号を指定する
    <div>
      <img src="./ce6.png" width="80%">
    </div>
  * コンテナインスタンスのサイズを指定する
    * "CPUおよびメモリー" > 小さめのもので動作可能
    * "インスタンスの最小数" > 1
      * ここを0にするとコールドスタート可能になるが、起動に30秒程かかる
      * コンテナの課金に合わせて変更する
    <div>
      <img src="./ce7.png" width="80%">
    </div>
  * 環境変数を設定する
    * ".env"ファイル内で指定した値を入力する
      * API_KEY
      * API_BASE_URL
    <div>
      <img src="./ce8.png" width="80%">
    </div>
    <div>
      <img src="./ce9.png" width="40%">
    </div>
  * 環境変数が設定されていることを確認して"作成"ボタンを押す
    <div>
      <img src="./ce10.png" width="80%">
    </div>
  * コンテナのデプロイが完了するとインスタンスの実行状態が表示される
    <div>
      <img src="./ce11.png" width="80%">
    </div>
  * "アプリケーションのテスト"より外部URLを確認する
    <div>
      <img src="./ce12.png" width="80%">
    </div>


  * 外部URLにデプロイされていることを確認する
    <div>
      <img src="./browser8.png" width="70%">
    </div>
