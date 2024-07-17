class PlayersController < ApplicationController
  def index
    @players = Player.all
  end

  def create
    @player = Player.create(params[:player].permit(:name, :number))
    render :json => @player
  end

  def update
    @player = Player.find(params[:id])
    @player.update(params[:player].permit(:name, :number))
    render :json => @player
  end

  def destroy
    Player.delete(params[:id])
    render :json => {}
  end
end
