class Api::InvitationSerializer < ActiveModel::Serializer

  attributes :id, :invitee_id, :inviter_id, :invitee_email, :inviter_email, :team_id, :sent_at, :accepted_at

  def invitee_email
    User.find_by(id: object.invitee_id).try(:email)
  end

  def inviter_email
    User.find_by(id: object.inviter_id).try(:email)
  end
end
