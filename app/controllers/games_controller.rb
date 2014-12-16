class GamesController < ApplicationController
  def show
    selected_player = params[:id].to_i - 1
    @user = User.all[selected_player] # Hack to select the user
  end
end
