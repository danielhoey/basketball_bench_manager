require_relative '../operations/create_snapshot'

class GamesController < ApplicationController
  def index
    @game = Game.where('DATE(created_at) = ?', Date.today).first
    if @game.nil?
      @game = Game.create
    end

    redirect_to game_path(@game)
  end

  def show
    @game = Game.find(params[:id])
    @players = Player.all
  end

  def snapshot
    cs = Operations::CreateSnapshot.new(params.slice(:game_id, :positions, :game_time, :real_time))
    if cs.execute
      render json: { status: 'success' }, status: :ok
    else
      render json: { status: 'error', errors: cs.errors}, status: :unprocessable_entity
    end
  end
end