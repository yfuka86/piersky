Rails.application.routes.draw do
  get '/auth/:action/callback', to: 'omniauth_callbacks'

  devise_for :user, path: '', path_names: {},
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords',
      confirmations: 'users/confirmations',
      omniauth_callbacks: 'users/omniauth_callbacks',
      unlocks: 'users/unlocks'
    }

  root 'welcome#index'

  get 'webapp', to: 'webapp#index', as: 'webapp'

  resources :integrations, only: [] do
    collection do
      get 'establish', to: 'integrations#establish'
      post '/:team_id/:webhook_uid', to: 'integrations#incoming_webhook'
    end
  end

  namespace :api, defaults: { format: :json } do
  end
end
