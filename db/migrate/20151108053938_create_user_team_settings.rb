class CreateUserTeamSettings < ActiveRecord::Migration
  def change
    create_table :user_team_settings do |t|
    	t.references :user
    	t.references :team 
    	t.integer :mail_state

      t.timestamps null: false
    end
  end
end
