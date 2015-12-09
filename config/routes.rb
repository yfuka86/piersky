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

  devise_scope :user do
    get '/signed_up/:id', to: 'users/registrations#signed_up', as: 'signed_up'
  end

  require 'sidekiq/web'
  authenticate :user, lambda { |u| u.email.in?(['yuta@piersky.com', 'yurimatsui37@gmail.com']) } do
    mount Sidekiq::Web, at: "/sidekiq"
  end

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

  resources :graphs, only: [:index]

  namespace :api, defaults: { format: :json } do
    resources :users, only: [] do
      collection do
        get 'me'
      end

      member do
        get 'stats'
      end
    end

    resources :teams, only: [] do
      collection do
        get 'current'
        get 'stats'
      end
    end

    resources :identities, only: [:index, :update] do
      member do
        get 'stats'
      end
    end
    resources :integrations, only: [:index, :show, :update, :destroy] do
      member do
        get 'stats'
      end
    end
    resources :invitations, only: [:index, :create, :update, :destroy]
  end

  if Rails.env.development?
    mount MailPreview => 'mail_view'
  end

end
