class ActivityGithub < ActiveRecord::Base
  # include Cequel::Record
  # key :identity_id, :int
  # key :ts, :timestamp

  # column :code, :int, index: true
  # column :id, :uuid, auto: true, index: true

  # column :repository_id, :int, index: true
  # column :issue_id, :int, index: true
  # column :pull_request_id, :int, index: true
  # column :comment_id, :int, index: true
  # set :commits_id, :text

  # column :action, :text
  # column :ref, :text, index: true

  # mmm
  # column :payload, :text

  # ちょっと非正規だけど直感的なのでbelongs_toはこの構成
  belongs_to :github_repository
  belongs_to :github_issue
  belongs_to :github_pull_request
  has_one :github_comment, foreign_key: "activity_id", class_name: "GithubComment"
  has_many :github_commit_activities
  has_many :github_commits, through: :github_commit_activities

  # https://developer.github.com/v3/activity/events/types
  CODES = {default: 0, commit_comment: 1, issue_comment: 12,
           issues: 13, pr: 18, pr_review_comment: 19, push: 20}
  ISSUE_EVENTS = ['assigned', 'unassigned', 'labeled', 'unlabeled', 'opened', 'closed', 'reopened']
  PR_EVENTS = ISSUE_EVENTS + ['synchronize']

  scope :by_integration, -> (integration) { where(identity_id: integration.identities.pluck(:id)) }

  def self.summary(integration)
    SkyModule.get_day_time_series(self.where(identity_id: integration.identities.pluck(:id)))
  end

  def self.oldest_ts(integration)
    self.by_integration(integration).order(ts: :asc).first.try(:ts)
  end

  def self.latest_ts(integration)
    self.by_integration(integration).order(ts: :desc).first.try(:ts)
  end

  def self.create_with_webhook(payload, webhook)
    p = payload
    integration = webhook.integration

    ActiveRecord::Base.transaction do
      if p["action"] == "created" && p["comment"]
        if p["issue"]
          activity = self.create(code: CODES[:issue_comment])
          activity.issue_id = GithubIssue.find_or_create(p["issue"], integration).id
        elsif p["pull_request"]
          activity = self.create(code: CODES[:pr_review_comment])
          activity.pull_request_id = GithubPullRequest.find_or_create(p["pull_request"], integration).id
        else
          activity = self.create(code: CODES[:commit_comment])
        end
        GithubComment.find_or_create(p["comment"], integration, activity)
        activity.ts = p["comment"]["created_at"]
      end

      if p["action"].in?(ISSUE_EVENTS) && p["issue"]
        activity = self.create(code: CODES[:issues])
        activity.issue_id = GithubIssue.find_or_create(p["issue"], integration).id
        activity.ts = p["issue"]["updated_at"]
      end

      if p["action"].in?(PR_EVENTS) && p["pull_request"]
        activity = self.create(code: CODES[:pr])
        activity.pull_request_id = GithubPullRequest.find_or_create(p["pull_request"], integration).id
        activity.ts = p["pull_request"]["updated_at"]
      end

      if p["ref"] && p["commits"]
        activity = self.create(code: CODES[:push])
        activity.ref = p["ref"]
        p["commits"].each{|c| GithubCommit.find_or_create(c, integration, activity)}
        activity.ts = p["head_commit"]["timestamp"]
      end

      if defined?(activity) && activity.class == self
        # activity.payload = p.to_s
        activity.repository_id = GithubRepository.find_or_create(p["repository"], integration).id

        activity.identity_id = IdentityGithub.find_or_initialize_with_payload(payload, integration).tap(&:save!).id
        activity.save!
        true
      else
        false
      end
    end
  end
end
