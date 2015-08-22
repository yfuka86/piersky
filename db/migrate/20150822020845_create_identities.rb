class CreateIdentities < ActiveRecord::Migration
  def change
    create_table :identities do |t|
      t.string :type, null: false
      t.belongs_to :user, index: true

      t.timestamps null: false
    end
  end
end
