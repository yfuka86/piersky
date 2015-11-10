class AddRepositoryIdToTables < ActiveRecord::Migration
  def change
    add_column :github_issues, :repository_id, :integer, null: false, default: 0
    add_column :github_pull_requests, :repository_id, :integer, null: false, default: 0
  end
end
