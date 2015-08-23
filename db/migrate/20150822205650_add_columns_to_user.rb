class AddColumnsToUser < ActiveRecord::Migration
  def change
    add_column :users, :external_cid, :string, null: true, limit: 50
    add_index :users, :external_cid
  end
end
