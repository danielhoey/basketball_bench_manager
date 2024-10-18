class Snapshot < ApplicationRecord
  belongs_to :game
  belongs_to :player

  validates :position, presence: true
  validates :game_time, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :real_time, presence: true

  scope :for_game, ->(game) { where(game: game) }
  scope :for_player, ->(player) { where(player: player) }
  scope :chronological, -> { order(:game_time, :real_time) }

  def self.summarise_player_times(game_id)
    player_times = Hash.new{ |hash, key| hash[key] = {'bench' => 0, 'court' => 0} }
    current_snapshot = Snapshot.new
    Snapshot.where(game_id: game_id).order(:player_id, :game_time).each do |snapshot|
        if current_snapshot.player_id != snapshot.player_id
            player_times[current_snapshot.player_id]['last_position'] = current_snapshot.position unless current_snapshot.player_id.nil?
            current_snapshot = snapshot
            next
        end

        time = snapshot.game_time - current_snapshot.game_time
        player_times[snapshot.player_id][current_snapshot.position] += time
        current_snapshot = snapshot
    end
    player_times[current_snapshot.player_id]['last_position'] = current_snapshot.position
    player_times
  end
end
