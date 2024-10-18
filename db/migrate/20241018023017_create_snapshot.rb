class CreateSnapshot < ActiveRecord::Migration[7.1]
  def change
    create_table :snapshots do |t|
      t.references :game, null: false, foreign_key: true
      t.references :player, null: false, foreign_key: true
      t.string :position
      t.integer :game_time
      t.datetime :real_time
    end
  end
end
