class CreateIdentities < ActiveRecord::Migration
  def change
    create_table :identities do |t|
      t.belongs_to :user_team, index: true
      t.string :type, null: false
      t.string :primary_key, null: false

      t.timestamps null: false
    end
  end
end
