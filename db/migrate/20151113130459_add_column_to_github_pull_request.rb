class AddColumnToGithubPullRequest < ActiveRecord::Migration
  def change
    add_column :github_repositories, :default_branch, :string, null: false, default: ""
  end
end
