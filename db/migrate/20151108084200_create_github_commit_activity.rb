class CreateGithubCommitActivity < ActiveRecord::Migration
  def change
    create_table :github_commit_activities do |t|
      t.integer :parent_id, null: false
      t.integer :child_id, null: false
    end
    remove_column :github_commits, :activity_id, :integer
  end
end
