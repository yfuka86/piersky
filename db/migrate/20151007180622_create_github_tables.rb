class CreateGithubTables < ActiveRecord::Migration
  def change
    create_table :activity_githubs do |t|
      t.integer :identity_id
      t.datetime :ts
      t.integer :code
      t.integer :repository_id
      t.integer :issue_id
      t.integer :pull_request_id

      t.string :action, limit: 20
      t.string :ref
    end
    add_index :activity_githubs, [:identity_id, :ts, :code], using: :btree

    create_table :github_repositories do |t|
      t.integer :integration_id
      t.integer :id
      t.string :full_name
    end
    add_index :github_repositories, [:integration_id, :id], using: :btree

    create_table :github_pull_requests do |t|
      t.integer :integration_id
      t.integer :id
      t.datetime :ts
      t.integer :number
      t.string :title
      t.string :state
      t.string :url
    end
    add_index :github_pull_requests, [:integration_id, :id], using: :btree

    create_table :github_issues do |t|
      t.integer :integration_id
      t.integer :id
      t.datetime :ts
      t.integer :number
      t.string :title
      t.string :state
      t.string :url
    end
    add_index :github_issues, [:integration_id, :id], using: :btree

    create_table :github_comments do |t|
      t.integer :activity_id

      t.integer :integration_id
      t.string :id
      t.datetime :ts
      t.string :body
      t.string :url
    end
    add_index :github_comments, [:activity_id, :integration_id, :id, :ts], using: :btree

    create_table :github_commits do |t|
      t.integer :activity_id

      t.integer :integration_id
      t.string :id
      t.datetime :ts
      t.string :message
      t.string :url
    end
    add_index :github_commits, [:activity_id, :integration_id, :id, :ts], using: :btree
  end
end
