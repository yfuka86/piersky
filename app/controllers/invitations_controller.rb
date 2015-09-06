class InvitationsController < WebBaseController
  layout 'welcome_auth'

  skip_before_action :authenticate_user!, only:[:edit, :update]
  before_action :confirm_invitation, only:[:edit, :update]

  # /invitations/edit?token=abcdef
  def edit
    unless @is_first_time
      ActiveRecord::Base.transaction do
        invitation, invitee = Invitation.accept_with_attributes(accept_params)
      end
      redirect_to webapp_path
    end
  end

  def update
    # redirect_to new_user_session_path, alert: t('auth.message.failed_to_accept_invitation') and return unless Invitation.can_accept?(accept_params[:token])
    invitation, invitee = Invitation.accept_with_attributes(accept_params)
    if invitee.errors.empty? && invitation.errors.empty?
      sign_in(:user, invitee)
      redirect_to webapp_path and return
    else
      raise (invitee.errors.full_messages + invitation.errors.full_messages).join(',')
    end
  end

  private

  def accept_params
    params.permit(:token, :password)
  end

  def confirm_invitation
    if !Invitation.can_accept?(params[:token])
      redirect_to new_user_session_path, alert: t('auth.message.failed_to_accept_invitation') and return
    end

    @invitation = Invitation.by_token(params[:token])
    @inviter = @invitation.inviter
    @invitee = @invitation.invitee
    @team = @invitation.team
    @is_first_time = @invitee.teams.blank?

    authenticated = warden.authenticated?(:user)

    if authenticated && @invitation.invitee != warden.user(:user)
      redirect_to after_sign_in_path_for(:user), alert: t("auth.message.invitation_is_not_yours") and return
    end
  end

end
