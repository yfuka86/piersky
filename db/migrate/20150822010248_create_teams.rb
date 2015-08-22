class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.string :name, null: false, default: "", limit: 50
      t.string :external_cid, null: true, limit: 50

      t.timestamps null: false
    end

    add_index :teams, :external_cid
  end
end
