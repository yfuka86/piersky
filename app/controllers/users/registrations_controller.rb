class Users::RegistrationsController < Devise::RegistrationsController
  layout 'welcome_auth'

# before_filter :configure_sign_up_params, only: [:create]
# before_filter :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    resource = (sign_up_params.present? && User.find_by(email: sign_up_params[:email])) ||
               build_resource(sign_up_params)
    if resource.persisted?
      if resource.confirmed?
        resource_saved = false
        resource.errors.add(:email, :taken)
      else
        resource_saved = resource.send(:generate_confirmation_token!)
      end
    else
      resource.class.skip_callback :create, :after, :send_on_create_confirmation_instructions
      resource_saved = resource.save
    end


    yield resource if block_given?
    if resource_saved
      AuthMailer.setup_mail(resource.id, resource.raw_confirmation_token).deliver_later

      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        expire_data_after_sign_in!
        respond_with resource, location: signed_up_path(id: resource.id, t: resource.raw_confirmation_token)
      end
    else
      clean_up_passwords resource
      redirect_to new_user_registration_path, alert: resource.errors.full_messages.join(', ')
    end
  end

  def signed_up
    @user = User.find_by(id: params[:id])

    if @user.present? && @user.id == User.confirmable_user(params[:t]).id
      @email = @user.email
    else
      redirect_to new_user_registration_path and return
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # You can put the params you want to permit in the empty array.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.for(:sign_up) << :attribute
  # end

  # You can put the params you want to permit in the empty array.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.for(:account_update) << :attribute
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
