class Api::InvitationsController < Api::BaseController

  def index
    @invitations = valid_team.invitations.order(id: :desc)
    render json: @invitations, each_serializer: Api::InvitationSerializer
  end

  def create
    users_params = params[:users].select{|user_params| user_params[:email].present? }
    render_error t('auth.message.invitation_needs_email'), status: :bad_request and return if users_params.blank?
    invitations, errors = Invitation.send_invitations(users_params, valid_user, valid_team)
    if errors.blank?
      render json: invitations, each_serializer: Api::InvitationSerializer
    else
      render_error errors, status: :bad_request
    end
  end

  # resend invitation
  def update
    invitation = valid_team.invitations.find_by(id: params[:id])
    render_error t('auth.message.failed_to_resend_invitation'), status: :bad_request and return unless invitation

    ActiveRecord::Base.transaction do
      invitation.send_invitation
    end
    render json: invitation, serializer: Api::InvitationSerializer, root: nil
  end

  # revoke invitation
  def destroy
    invitation = valid_team.invitations.find_by(id: params[:id])
    render_error t('http_status.bad_request.explanation'), status: :bad_request and return unless invitation

    if invitation.destroy
      render json: invitation, serializer: Api::InvitationSerializer, root: nil
    else
      render_error invitation.errors.full_messages, status: :bad_request
    end
  end
end