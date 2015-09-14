class ActivityGithub < Activity
  include Cequel::Record
  key :id, :timeuuid, auto: true
  column :integration_id, :int, index: true
  column :identity_id, :int, index: true
  column :payload, :text

  # # https://developer.github.com/v3/activity/events/types
  CODES = {default: 0, commit_comment: 1, issue_comment: 12,
           issues: 13, pr: 18, pr_review_comment: 19, push: 20}

  def self.create_with_webhook(payload, webhook)
    integration = webhook.integration
    if payload["action"] == "created"
      if payload["issue"]
        activity = self.create(code: :issue_comment)
      elsif payload["pull_request"]
        activity = self.create(code: :pr_review_comment)
      else
        activity = self.create(code: :commit_comment)
      end
    end

    if defined?(activity)
      activity.integration = integration
      activity.identity = IdentityGithub.find_or_initialize_with_payload(payload, integration)
      activity.save!
      activity.payload = payload.to_s
      true
    else
      false
    end
  end
end