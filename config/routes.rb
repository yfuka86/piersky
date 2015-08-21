Rails.application.routes.draw do

  devise_for :users
  root 'welcome#index'

  namespace :api, defaults: { format: :json } do
  end
end
