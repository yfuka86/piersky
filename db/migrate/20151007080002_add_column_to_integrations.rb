class AddColumnToIntegrations < ActiveRecord::Migration
  def change
    add_column :integrations, :status, :integer, null: false, default: 0
  end
end
