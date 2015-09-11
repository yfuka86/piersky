class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :type, null: false
      t.integer :code, null: false, default: 0, index: true
      t.belongs_to :integration, index: true
      t.belongs_to :identity, index: true

      t.timestamps null: false
    end
  end
end
