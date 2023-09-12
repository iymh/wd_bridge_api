# Watson Discovery Build Assets

## CSVデータをデータ検索に使用するためのカスタマイズ
  * 使用するCSVデータのタイトル部を決定する
    * "qustion", "answer"がJSONフィールド名に使用されます
    <div>
      <img src="./csv1.png" width="70%">
    </div>

## Discovery側設定
  * 新規コレクションを作成する
    <div>
      <img src="./wd1.png" width="70%">
    </div>
  * アップロードデータを選択する
    <div>
      <img src="./wd2.png" width="70%">
    </div>
  * コレクション名を指定する
    * "csv import" で作成
    <div>
      <img src="./wd3.png" width="70%">
    </div>
  * CSVファイルをアップロードする
    <div>
      <img src="./wd4.png" width="70%">
    </div>
  * 作成されたコレクションの管理画面を表示する
    <div>
      <img src="./wd5.png" width="70%">
    </div>
  * データ解析状況が完了になるまで待つ
    * "document processing" -> "document available"
    <div>
      <img src="./wd6.png" width="49%">
      <img src="./wd7.png" width="49%">
    </div>
  * 取り込み済みドキュメントを確認する
    * サンプルCSVファイルの５行が5件ドキュメントとして登録される
    <div>
      <img src="./wd8.png" width="70%">
    </div>
  * フィールド名を変更して値を表示する
    * "question", "answer"を選択する
    <div>
      <img src="./wd9.png" width="70%">
    </div>
  * 一覧に表示されていることを確認する
    <div>
      <img src="./wd10.png" width="70%">
    </div>
  * "Enrichments"タブで選択状態を全て未選択にする
    * 今回はエンティティ抽出やキーワード抽出は使用しない
    * ここの設定はJSONフィールドの出力値に影響する
      * "question","answer"はテキストで返却される
    <div>
      <img src="./wd13.png" width="70%">
    </div>


### Discoveryの画面で検索
  * 「印刷品質悪い」で検索してみる
    * 項目が表示されない
    <div>
      <img src="./wd_result1.png" width="70%">
    </div>
  * 表示設定を変更する
    * "Search results"
    <div>
      <img src="./wd_result2.png" width="70%">
    </div>
  * 上段に"answer", 下段に"question"を表示する
    <div>
      <img src="./wd_result3.png" width="70%">
    </div>
  * 検索結果の詳細を確認する
    * 青字の"View document"のリンクを押す
    * "Open advanced view"ボタンを押す
    <div>
      <img src="./wd_result4.png" width="70%">
    </div>
  * 表示データをJSONデータに変更する
    * "View as:"を "JSON"に変更
    * "question", "answer"フィールドに値が返却されていることを確認
    <div>
      <img src="./wd_result5.png" width="70%">
    </div>

### サンプルコンテンツのソースを修正
  * "setResultTable"の関数内でJSONデータのフィールド値を追加する
    * この処理はDiscoveryから取得したJSONデータから画面表示に使用するものだけをセットしている
    <div>
      <img src="./vscode2.png" width="50%">
    </div>
  * 画面に表示する箇所に追加する
    <div>
      <img src="./vscode3.png" width="90%">
    </div>


### ブラウザでコンテンツを確認
  * CSVをインポートしたコレクションを選択する
    <div>
      <img src="./browser9.png" width="80%">
    </div>
  * 「キーワード」で検索すると検索結果が表示される
    <div>
      <img src="./browser10.png" width="80%">
    </div>
