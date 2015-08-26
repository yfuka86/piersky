class CreateUserTeams < ActiveRecord::Migration
  def change
    create_table :user_teams do |t|
      t.integer :user_id, null: false
      t.integer :team_id, null: false
      t.boolean :is_logging_in, null: false, default: false
      t.integer :role, null: false, default: 0

      t.timestamps null: false
    end

    add_index :user_teams, [:user_id, :team_id], unique: true, using: :btree
  end
end
