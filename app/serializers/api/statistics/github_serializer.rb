class Api::Statistics::GithubSerializer < ActiveModel::Serializer
  attributes :integration_id, :today, :activities, :identities

  def integration_id
    object.id
  end

  def today
    @today ||= SkyModule.today
  end

  def activities
    @activities ||= [:commit_comment, :issue_comment, :pr_review_comment, :push]
  end

  def identities
    object.identities.map do |identity|
      q = ActivityGithub.where(identity_id: identity.id)

      activities_obj = {}
      activities.each do |activity|
        activities_obj[activity] = SkyModule.get_day_time_series(q.where(code: ActivityGithub::CODES[activity]))
      end

      {
        id: identity.id,
        default: SkyModule.get_day_time_series(q)
      }.merge(activities_obj)
    end
  end
end
