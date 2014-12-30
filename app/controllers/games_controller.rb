class GamesController < ApplicationController
  def show
    @player_id = params[:id]
  end
end
