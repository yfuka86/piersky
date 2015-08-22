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

  get 'webapp(/*path)', to: 'webapp#index', as: 'webapp'

  resources :integrations, only: [] do
    collection do
      get 'establish', to: 'integrations#establish'
      post '/:user_id/:webhook_uid', to: 'integrations#incoming_webhook'
    end
  end

  namespace :api, defaults: { format: :json } do
    resources :users, only: [] do
      collection do
        get 'me'
      end
    end

    resources :integrations, only: [:index]
    get 'slack_wrapper', to: 'slack_wrapper#index'
    get 'slack_wrapper/show/:id(/:ts)', to: 'slack_wrapper#show'
  end
end
