class CreateIdentities < ActiveRecord::Migration
  def change
    create_table :identities do |t|
      t.integer :team_id, null: false
      t.integer :user_team_id
      t.string :type, null: false
      t.string :primary_key, null: false
      t.string :secondary_key, default: ""
      t.string :email_key, default: ""
      t.boolean :is_verified, null: false, default: false

      t.timestamps null: false
    end
    add_index :identities, [:user_team_id, :type], using: :btree
  end
end
