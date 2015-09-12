class Activity::Github < Activity
  include Redis::Objects

  # https://developer.github.com/v3/activity/events/types
  enum code: {default: 0, commit_comment: 1, issue_comment: 12,
              issues: 13, pr: 18, pr_review_comment: 19, push: 20}

  def self.create_with_payload(payload)
    if payload["action"] == "created"
      if payload["issue"]
        activity = self.create(code: :issue_comment)
      elsif payload["pull_request"]
      else
      end
    end
  end
end
