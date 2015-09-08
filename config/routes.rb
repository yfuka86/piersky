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

  resources :invitations, only:[] do
    collection do
      get 'accept', to: 'invitations#edit'
      post 'accept', to: 'invitations#update'
    end
  end

  resources :integrations, only: [] do
    collection do
      post '/:user_id/:webhook_uid', to: 'integrations#incoming_webhook'
    end
  end

  namespace :api, defaults: { format: :json } do
    resources :users, only: [] do
      collection do
        get 'me'
      end
    end

    resources :teams, only: [] do
      collection do
        get 'current'
      end
    end

    resources :identities, only: [:index]
    resources :integrations, only: [:index, :show, :update, :destroy]
    resources :invitations, only: [:index, :create, :update, :destroy]

    get 'github_wrapper', to: 'github_wrapper#index'
    get 'github_wrapper/show/:user/:name', to: 'github_wrapper#index'
    get 'slack_wrapper(/:integration_id)', to: 'slack_wrapper#index'
    get 'slack_wrapper/:integration_id/show/:id(/:ts)', to: 'slack_wrapper#show'

    resources :slack_gathers, only: [:index, :create, :show ]
  end
end
