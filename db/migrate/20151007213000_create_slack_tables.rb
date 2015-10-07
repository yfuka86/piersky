class CreateSlackTables < ActiveRecord::Migration
  def change
    create_table :activity_slacks do |t|
      t.integer :identity_id
      t.datetime :ts

      t.string :channel_id
      t.string :type
      t.string :message, limit: 255
      t.text :long_message
    end
    add_index :activity_slacks, [:identity_id, :ts, :channel_id], using: :btree

    create_table :slack_teams do |t|
      t.integer :integration_id
      t.string :foreign_id
      t.string :name
      t.string :domain
      t.string :email_domain
    end
    add_index :slack_teams, [:integration_id, :foreign_id], using: :btree

    create_table :slack_channels do |t|
      t.integer :integration_id
      t.string :foreign_id
      t.datetime :ts
      t.string :name
      t.string :creator_id
      t.boolean :is_general
    end
    add_index :slack_channels, [:integration_id, :foreign_id], using: :btree
  end
end
