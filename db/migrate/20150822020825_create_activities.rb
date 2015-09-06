class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :type, null: false
      t.belongs_to :integration, index: true
      t.belongs_to :identity, index: true

      t.timestamps null: false
    end
  end
end
