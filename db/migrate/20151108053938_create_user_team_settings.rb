class CreateUserTeamSettings < ActiveRecord::Migration
  def change
    create_table :user_team_settings do |t|
    	t.integer :user_team_id
    	t.integer :mail_state

      t.timestamps null: false
    end
  end
end
