class ActivityGithub < Activity
  include Cequel::Record
  key :identity_id, :int
  key :ts, :timestamp

  column :code, :int, index: true
  column :id, :uuid, auto: true, index: true

  column :repository_id, :int, index: true
  column :issue_id, :int, index: true
  column :pull_request_id, :int, index: true
  column :comment_id, :int, index: true
  set :commits_id, :text

  column :action, :text
  column :ref, :text, index: true

  # mmm
  # column :payload, :text

  # https://developer.github.com/v3/activity/events/types
  CODES = {default: 0, commit_comment: 1, issue_comment: 12,
           issues: 13, pr: 18, pr_review_comment: 19, push: 20}
  ISSUE_EVENTS = ['assigned', 'unassigned', 'labeled', 'unlabeled', 'opened', 'closed', 'reopened']
  PR_EVENTS = ISSUE_EVENTS + ['synchronize']

  def self.create_with_webhook(payload, webhook)
    p = payload
    integration = webhook.integration
    if p["action"] == "created" && p["comment"]
      if p["issue"]
        activity = self.new(code: CODES[:issue_comment])
        activity.issue_id = GithubIssue.find_or_create(p["issue"]).id
      elsif p["pull_request"]
        activity = self.new(code: CODES[:pr_review_comment])
        activity.pull_request_id = GithubPullRequest.find_or_create(p["pull_request"]).id
      else
        activity = self.new(code: CODES[:commit_comment])
      end
      activity.comment_id = GithubComment.find_or_create(p["comment"]).id
      activity.ts = p["comment"]["created_at"]
    end

    if p["action"].in?(ISSUE_EVENTS) && p["issue"]
      activity = self.new(code: CODES[:issues])
      activity.issue_id = GithubIssue.find_or_create(p["issue"]).id
      activity.ts = p["issue"]["updated_at"]
    end

    if p["action"].in?(PR_EVENTS) && p["pull_request"]
      activity = self.new(code: CODES[:pr])
      activity.pull_request_id = GithubPullRequest.find_or_create(p["pull_request"]).id
      activity.ts = p["pull_request"]["updated_at"]
    end

    if p["ref"] && p["commits"]
      activity = self.new(code: CODES[:push])
      activity.ref = p["ref"]
      activity.commits_id = p["commits"].map{|c| GithubCommit.find_or_create(c).id}
      activity.ts = p["head_commit"]["timestamp"]
    end

    if defined?(activity) && activity.class == self
      # activity.payload = p.to_s
      activity.repository_id = GithubRepository.find_or_create(p["repository"]).id

      activity.identity_id = IdentityGithub.find_or_initialize_with_payload(payload, integration).tap(&:save!).id
      activity.save!
      true
    else
      false
    end
  end
end
