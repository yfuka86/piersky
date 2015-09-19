class OmniauthCallbacksController < WebBaseController

  # todo integration for user auth

  # def self.provides_signin_callback_for(provider)
  #   class_eval %Q{
  #     def #{provider}
  #       auth = env["omniauth.auth"]
  #       @user = User.find_for_oauth auth, current_user

  #       klass = "Integration#{provider.classify}".constantize
  #       klass.build_with_auth_and_user(auth, @user)

  #       if @user.persisted?
  #         sign_in_and_redirect @user, event: :authentication
  #         set_flash_message(:notice, :success, kind: "#{provider}".capitalize) if is_navigational_format?
  #       else
  #         session["devise.#{provider}_data"] = env["omniauth.auth"]
  #         redirect_to login_path
  #       end
  #     end
  #   }
  # end

  # OMNIAUTHFORIDENTITY.each do |provider, credentials|
  #   provides_signin_callback_for provider
  # end

  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        return unless current_user
        auth = env["omniauth.auth"]
        klass = "Integration#{provider.classify}".constantize
        integration = klass.create_with_user(auth, current_user)

        redirect_to after_callback_path(integration.id)
      end
    }
  end

  OMNIAUTH.each do |provider, credentials|
    provides_callback_for provider
  end

  private

  def after_callback_path(id)
    webapp_path(path: "integrations/#{id}/settings")
  end

  # def after_sign_in_path_for(resource)
  #   if true #resource.email_verified? (todo make finish_signup_display)
  #     root_path
  #   else
  #     finish_signup_path(resource)
  #   end
  # end

end
