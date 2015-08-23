class CreateSlackActivities < ActiveRecord::Migration
  def change
    create_table :slack_activities do |t|
      t.string :user_id, null: false, default: "", limit: 50
      t.string :channel, null: false, limit: 50
      t.string :ts, null: false, default: "", limit: 50
      t.string :message ,null: false, default: "", limit: 100

      t.timestamps null: false
    end
  end
end
