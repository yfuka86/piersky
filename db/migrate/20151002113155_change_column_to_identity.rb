class ChangeColumnToIdentity < ActiveRecord::Migration
  def change
    remove_column :identities, :team_id, :integer
    add_column :identities, :integration_id, :integer, null: false, index: true
    add_column :identities, :name, :string
  end
end
