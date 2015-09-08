class CreateIdentities < ActiveRecord::Migration
  def change
    create_table :identities do |t|
      t.integer :user_team_id, null: false
      t.string :type, null: false
      t.string :primary_key, null: false
      t.string :secondary_key, default: ""
      t.boolean :is_verified, null: false, default: false

      t.timestamps null: false
    end
    add_index :identities, [:user_team_id, :type], unique: true, using: :btree
  end
end
