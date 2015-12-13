class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.integer :code
      t.string :body

      t.timestamps null: false
    end
    add_index :logs, [:code, :body], using: :btree
  end
end
