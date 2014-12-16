Rails.application.routes.draw do
  root 'welcome#index'

  resources :games, only: [:show]
end
