class Activity::Github < Activity

  ISSUE_EVENTS = ['assigned', 'unassigned', 'labeled', 'unlabeled', 'opened', 'closed', 'reopened']
  PR_EVENTS = ISSUE_EVENTS + ['synchronize']

  include Redis::Objects

  value :payload
  value :repo_id

  value :comment_id
  value :comment_body

  value :issue_action
  value :issue_id
  value :issue_title

  value :pr_action
  value :pr_id
  value :pr_title

  value :commit_id

  # https://developer.github.com/v3/activity/events/types
  enum code: {default: 0, commit_comment: 1, issue_comment: 12,
              issues: 13, pr: 18, pr_review_comment: 19, push: 20}

  def self.create_with_webhook(payload, webhook)
    integration = webhook.integration
    p = payload
    ActiveRecord::Base.transaction do
      if p["action"] == "created" && p["comment"]
        if p["issue"]
          activity = self.create(code: :issue_comment)
          activity.issue_id = p["issue"]["id"]
          activity.issue_title = p["issue"]["title"]
        elsif p["pull_request"]
          activity = self.create(code: :pr_review_comment)
          activity.pr_id = p["pull_request"]["id"]
        else
          activity = self.create(code: :commit_comment)
          activity.commit_id = p["comment"]["commit_id"]
        end
        activity.comment_id = p["comment"]["id"]
        activity.comment_body = p["comment"]["body"]
        activity.ts = p["comment"]["created_at"]
      end

      if p["action"].in? ISSUE_EVENTS && p["issue"]
        activity = self.create(code: :issues)
        activity.issue_action = p["action"]
        activity.issue_id = p["issue"]["id"]
        activity.issue_title = p["issue"]["title"]
      end

      if p["action"].in? PR_EVENTS && p["pull_request"]
        activity = self.create(code: :pr)
        activity.pr_action = p["action"]
        activity.pr_id = p["pull_request"]["id"]
        activity.pr_title = p["pull_request"]["title"]
      end

      if defined?(activity)
        activity.payload = p.to_s
        activity.repo_id = p["repository"]["id"]
        activity.integration = integration
        activity.identity = Identity::Github.find_or_initialize_with_payload(payload, integration)
        activity.save!
        true
      else
        false
      end
    end
  end
end
