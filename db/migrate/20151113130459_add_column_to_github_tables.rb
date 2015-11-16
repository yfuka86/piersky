class AddColumnToGithubTables < ActiveRecord::Migration
  def change
    add_column :github_repositories, :default_branch, :string, null: false, default: ""
    add_column :github_commits, :author_name, :string, default: ""
  end
end
