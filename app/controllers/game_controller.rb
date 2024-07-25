class GameController < ApplicationController
  def index
    @players = Player.all
  end
end