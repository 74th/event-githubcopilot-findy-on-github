# Copilot Instructions for 006-agent_with_instruction

## 概要
このリポジトリは、シンプルなToDo管理アプリのサンプル実装です。Python(Flask)によるAPIサーバー(`todo_api/`)、TypeScript(React)によるフロントエンド(`todo_frontend/`)で構成されています。

## アーキテクチャ
- **todo_api/**: Python製APIサーバー。ドメイン層(`domain/`)、インメモリDB(`memdb/`)、Flaskサーバー(`server/`)で構成。
  - `domain/entity/entity.py`: タスクの型定義(TypedDict: Task)
  - `domain/usecase/operations.py`: ユースケース(タスク一覧/追加/完了)
  - `memdb/memdb.py`: インメモリDB実装。Taskのリストを管理
  - `server/api.py`: Flaskエンドポイント定義
- **todo_frontend/**: React+TypeScript製フロントエンド。API通信は`src/api/task.ts`等で実装。

## 主要なデータフロー
- フロントエンドからAPIサーバーへHTTPリクエスト
- サーバーは`OperationInteractor`経由でDB操作
- タスクは`Task`型(dict)で一貫してやりとり

## 開発・ビルド・テスト
- Pythonサーバー起動: `python -m todo_api.server.api` または `python todo_api/server/api.py`
- フロントエンド起動: `cd todo_frontend && npm start`
- フロントエンドビルド: `cd todo_frontend && npm run build`
- Pythonテスト: `python -m unittest discover todo_api/`
- フロントエンドテスト: `cd todo_frontend && npm test`

## プロジェクト固有のコーディング規約・パターン
- Pythonのドメイン層はTypedDictで型定義し、dictとして扱う
- DBはインメモリ実装(MemDB)で、TaskのIDはリスト長で自動採番
- ユースケース層(OperationInteractor)でビジネスロジックを集約
- APIはFlaskで実装し、JSONでやりとり
- フロントエンドはReact Hooks/関数コンポーネント中心
- API通信は`/api/tasks`等のRESTエンドポイントを利用

## 参考ファイル
- `todo_api/domain/entity/entity.py` : Task型定義
- `todo_api/domain/usecase/operations.py` : ユースケース
- `todo_api/memdb/memdb.py` : インメモリDB
- `todo_api/server/api.py` : Flask API
- `todo_frontend/src/api/task.ts` : API通信例

## 注意点
- DBは永続化されません。再起動で初期化されます
- 型安全性はTypedDict/TypeScriptで担保
- テストはunittest/React Testing Libraryで記述

---
この内容に不明点や追加したい情報があればご指摘ください。
