class CreateIntegrationWebhooks < ActiveRecord::Migration
  def change
    create_table :integration_webhooks do |t|
      t.belongs_to :integration, index: true
      t.string :uid
      t.string :name
      t.string :external_uid #Githubとか向こう側が持ってるuid
    end
    add_foreign_key :integration_webhooks, :integrations
    add_index :integration_webhooks, :uid, unique: true, using: :btree
    remove_column :integration_settings, :syncable
  end
end
