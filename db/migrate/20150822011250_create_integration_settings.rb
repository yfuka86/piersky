class CreateIntegrationSettings < ActiveRecord::Migration
  def change
    create_table :integration_settings do |t|
      t.belongs_to :integration, index: true
      t.string :syncable
      t.string :webhook_token
    end
    add_index :integration_settings, :webhook_token, unique: true, using: :btree
    add_foreign_key :integration_settings, :integrations
  end
end
