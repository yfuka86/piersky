class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.integer :invitee_id, null: false
      t.integer :inviter_id, null: false
      t.integer :team_id, null: false
      t.datetime :sent_at
      t.datetime :accepted_at
      t.string :token

      t.timestamps null: false
    end
  end
end
