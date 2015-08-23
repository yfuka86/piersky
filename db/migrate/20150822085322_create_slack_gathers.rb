class CreateSlackGathers < ActiveRecord::Migration
  def change
    create_table :slack_gathers do |t|
      t.integer :own_id, null: false, foreign_key: true
      t.string :title, null: false, default: "", limit: 50

      t.timestamps null: false
    end
  end
end
