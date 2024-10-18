class Snapshot < ApplicationRecord
  belongs_to :game
  belongs_to :player

  validates :position, presence: true
  validates :game_time, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :real_time, presence: true

  scope :for_game, ->(game) { where(game: game) }
  scope :for_player, ->(player) { where(player: player) }
  scope :chronological, -> { order(:game_time, :real_time) }
end
