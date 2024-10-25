class CreateSnapshot
  def initialize(params)
    @game_id = params[:game_id]
    @positions = params[:positions]
    @game_time = params[:game_time]
    @real_time = params[:real_time]
  end

  def execute
    @positions.each do |position, player_ids|
      player_ids.each do |player_id|
        Snapshot.create!(game_id: @game_id,
                         player_id: player_id,
                         position: position,
                         game_time: @game_time,
                         real_time: @real_time)
      end
    end
  end
end