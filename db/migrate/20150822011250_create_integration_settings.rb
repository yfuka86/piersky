class CreateIntegrationSettings < ActiveRecord::Migration
  def change
    create_table :integration_settings do |t|
      t.integer :integration_id, null: false, index: true
      t.string :webhook_token
    end
    add_foreign_key :integration_settings, :integrations
    add_index :integration_settings, :webhook_token, unique: true, using: :btree
  end
end
