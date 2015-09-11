class Activity::Github < Activity
  # https://developer.github.com/v3/activity/events/types/#issuesevent
  enum code: {default: 0, commit_comment: 1, issue_comment: 12,
              issues: 13, pr: 18, pr_review_comment: 19, push: 20}

  def create_with_payload(payload)
    if payload["zen"].present?
      self.update_attribute(:external_uid, payload["hook_id"])
    elsif payload["action"] == "opened"
      issue_params = payload["issue"] || payload["pull_request"]
    end
  end
end
