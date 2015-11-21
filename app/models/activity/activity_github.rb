class ActivityGithub < ActiveRecord::Base
  include Concerns::Activity

  # ちょっと非正規だけど直感的なのでbelongs_toはこの構成
  belongs_to :repository, class_name: 'GithubRepository', foreign_key: :repository_id
  belongs_to :issue, class_name: 'GithubIssue', foreign_key: :issue_id
  belongs_to :pull_request, class_name: 'GithubPullRequest', foreign_key: :pull_request_id
  has_one :comment, class_name: 'GithubComment', foreign_key: :activity_id
  has_many :github_commit_activities, foreign_key: :parent_id
  has_many :commits, through: :github_commit_activities, source: :commit

  # https://developer.github.com/v3/activity/events/types
  CODES = {default: 0, commit_comment: 1, issue_comment: 12,
           issues: 13, pr: 18, pr_review_comment: 19, push: 20}
  ISSUE_EVENTS = ['assigned', 'unassigned', 'labeled', 'unlabeled', 'opened', 'closed', 'reopened']
  PR_EVENTS = ISSUE_EVENTS + ['synchronize']

  scope :issues_event, -> (integration) {
    by_integration(integration).
    where(code: CODES[:issues])
  }
  scope :pr_event, -> (integration) {
    by_integration(integration).
    where(code: CODES[:pr])
  }
  scope :comment_event, -> (integration) {
    by_integration(integration).
    where(code: [CODES[:commit_comment], CODES[:issue_comment], CODES[:pr_review_comment]])
  }
  scope :pushed_to_default_event, -> (integration) {
    by_integration(integration).
    where(code: CODES[:push]).
    joins(:repository).
    where("char_length(substring(activity_githubs.ref, github_repositories.default_branch)) != 0")
  }

  def self.daily_summary(integration)
    obj = {}
    obj[:main] = daily_time_series(integration)

    commit_obj = {}
    GithubCommit.
      where(ts: SkyModule.yesterday_range).
      group_by_author(integration).
      count.
      each{|author, count| commit_obj[
        IdentityGithub.find_by('secondary_key=? OR name=?', author, author).try(:id)
      ] = count}
    obj[:commits] = commit_obj

    obj[:comments] = self.
      where(ts: SkyModule.yesterday_range).
      comment_event(integration).
      group(:identity_id).count

    obj[:opened_prs] = self.
      where(ts: SkyModule.yesterday_range, action: 'opened').
      pr_event(integration).
      group(:identity_id).count
    obj[:closed_prs] = self.
      where(ts: SkyModule.yesterday_range, action: 'closed').
      pr_event(integration).
      group(:identity_id).count

    obj[:issues] = self.
      where(ts: SkyModule.yesterday_range, action: 'opened').
      issues_event(integration).
      group(:identity_id).count
    obj[:issues] = self.
      where(ts: SkyModule.yesterday_range, action: 'closed').
      issues_event(integration).
      group(:identity_id).count
    obj
  end

  def self.create_with_webhook(payload, webhook)
    p = payload
    integration = webhook.integration

    ActiveRecord::Base.transaction do
      if p["action"] == "created" && p["comment"]
        if p["issue"]
          activity = self.create(code: CODES[:issue_comment])
          activity.issue_id = GithubIssue.find_or_create!(p, integration).id
        elsif p["pull_request"]
          activity = self.create(code: CODES[:pr_review_comment])
          activity.pull_request_id = GithubPullRequest.find_or_create!(p, integration).id
        else
          activity = self.create(code: CODES[:commit_comment])
        end
        activity.action = p["action"]
        GithubComment.find_or_create!(p["comment"], integration, activity)
        activity.ts = p["comment"]["created_at"]
      end

      if p["action"].in?(ISSUE_EVENTS) && p["issue"]
        activity = self.create(code: CODES[:issues])
        activity.action = p["action"]
        activity.issue_id = GithubIssue.find_or_create!(p, integration).id
        activity.ts = p["issue"]["updated_at"]
      end

      if p["action"].in?(PR_EVENTS) && p["pull_request"]
        activity = self.create(code: CODES[:pr])
        activity.action = p["action"]
        activity.pull_request_id = GithubPullRequest.find_or_create!(p, integration).id
        activity.ts = p["pull_request"]["updated_at"]
      end

      if p["ref"] && p["commits"]
        activity = self.create(code: CODES[:push])
        activity.ref = p["ref"]
        p["commits"].each{|c| GithubCommit.find_or_create!(c, integration, activity)}
        activity.ts = p["head_commit"]["timestamp"]
      end

      if defined?(activity) && activity.class == self
        # activity.payload = p.to_s
        activity.repository_id = GithubRepository.find_or_create!(p["repository"], integration).id

        activity.identity_id = IdentityGithub.find_or_initialize_with_payload(payload, integration).tap(&:save!).id
        activity.save!
        true
      else
        false
      end
    end
  end
end
