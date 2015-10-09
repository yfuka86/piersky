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
    period = SkyModule.get_period
    q = ActivityGithub.where(identity_id: object.identities.pluck(:id), ts: period)
                      .group('identity_id', 'code', "date_trunc('day',ts)").count

    object.identities.map do |identity|
      counts = q.select{|k, v| k[0] == identity.id}

      activities_obj = {}
      activities.each do |activity|
        activities_obj[activity] = period.map{|d| counts.find{|k, v| k[1] == ActivityGithub::CODES[activity] && k[2] == d}.try(:[], 1) || 0 }.reverse
      end

      {
        id: identity.id,
        default: period.map{|d| counts.select{|k, v| k[2] == d}.values.sum }.reverse
      }.merge(activities_obj)
    end
  end
end
