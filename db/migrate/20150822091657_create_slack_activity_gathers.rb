class CreateSlackActivityGathers < ActiveRecord::Migration
  def change
    create_table :slack_activity_gathers do |t|
      t.references :slack_activity, index: true, foreign_key: true, null: false
      t.references :slack_gather, index: true, foreign_key: true, null: false

      t.timestamps null: false
    end
  end
end
