class Api::InvitationsController < Api::BaseController

  def index
    team = valid_user.teams.find_by(external_cid: params[:team_id])
    @invitations = team.invitations.order(id: :desc)
    render json: @invitations, each_serializer: Api::InvitationSerializer
  end

  def create
    team = valid_user.teams.find_by(external_cid: params[:team_id])
    if !team
      render_error t('auth.message.failed_to_send_invitation'), status: :bad_request and return
    end
    users_params = params[:users].select{|user_params| user_params[:email].present? }
    render_error t('auth.message.invitation_needs_email'), status: :bad_request and return if users_params.blank?
    invitations, errors = Invitation.send_invitations(users_params, valid_user, team)
    if errors.blank?
      render json: invitations, each_serializer: Api::InvitationSerializer
    else
      render_error errors, status: :bad_request
    end
  end

  # resend invitation
  def update
    team = valid_user.teams.find_by(external_cid: params[:team_id])
    invitation = team.invitations.find_by(id: params[:id])
    if !team || !invitation
      render_error t('auth.message.failed_to_send_invitation'), status: :bad_request and return
    end
    ActiveRecord::Base.transaction do
      invitation.send_invitation
    end

    render_success
  end

  # revoke invitation
  def destroy
    team = valid_user.teams.find_by(external_cid: params[:team_id])
    invitation = team.invitations.find_by(id: params[:id])
    if !team || !invitation
      render_error t('http_status.bad_request.explanation'), status: :bad_request and return
    end

    if invitation.destroy
      render json: invitation, serializer: Api::InvitationSerializer, root: nil
    end
  end
end