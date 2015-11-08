class CreateGithubCommitActivity < ActiveRecord::Migration
  def change
    create_table :github_commit_activities do |t|
      t.integer :github_commit_id, null: false
      t.integer :github_activity_id, null: false
    end
    remove_column :github_commits, :activity_id
  end
end
