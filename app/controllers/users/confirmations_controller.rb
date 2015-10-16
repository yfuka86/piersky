class Users::ConfirmationsController < Devise::ConfirmationsController
  layout 'welcome_auth'

  prepend_before_filter :require_no_authentication, only: [:setup, :complete_setup]

  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  # def create
  #   super
  # end

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    ActiveRecord::Base.transaction do
      self.resource = resource_class.confirm_by_token(params[:confirmation_token])
      yield resource if block_given?

      raise ActiveRecord::RecordInvalid.new(resource) if !resource.errors.empty?
    end
    sign_in(resource_name, resource)
    redirect_to root_path and return
  rescue ActiveRecord::RecordInvalid => ex
    redirect_to root_path, alert: resource.errors.full_messages.first
  end

  # protected

  # The path used after resending confirmation instructions.
  # def after_resending_confirmation_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  # The path used after confirmation.
  # def after_confirmation_path_for(resource_name, resource)
  #   super(resource_name, resource)
  # end
end
