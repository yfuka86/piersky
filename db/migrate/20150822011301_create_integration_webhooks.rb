class CreateIntegrationWebhooks < ActiveRecord::Migration
  def change
    create_table :integration_webhooks do |t|
      t.integer :integration_id, index: true
      t.string :uid
      t.string :name
      t.string :external_uid #Githubとか向こう側が持ってるuid
    end
    add_foreign_key :integration_webhooks, :integrations
    add_index :integration_webhooks, :uid, unique: true, using: :btree
  end
end
