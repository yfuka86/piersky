class CreateIntegrations < ActiveRecord::Migration
  def change
    create_table :integrations do |t|
      t.integer    :user_id
      t.integer    :team_id
      t.string     :type, null: false
      t.string     :token
      t.string     :secret

      t.timestamps null: false
    end
    add_index :integrations, :team_id, unique: true, using: :btree
  end
end
