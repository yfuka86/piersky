class Api::Statistics::GithubSerializer < ActiveModel::Serializer
  attributes :integration_id, :today, :activities, :identities

  def integration_id
    object.id
  end

  def today
    @today ||= Date.today
  end

  def activities
    @activities ||= [:commit_comment, :issue_comment, :pr_review_comment, :push]
  end

  def identities
    object.identities.map do |identity|
      activities_obj = {}
      activities.each do |k|
        activities_obj[k] = period_map(ActivityGithub[identity.id].where(code: ActivityGithub::CODES[k])).map(&:count)
      end

      {
        id: identity.id,
        default: period_map(ActivityGithub[identity.id]).map(&:count),
      }.merge(activities_obj)
    end
  end

  def period_map(q)
    (1..31).map{|i| q.after(today - (i - 1).day).upto(today - (i - 2).day) }
  end
end
