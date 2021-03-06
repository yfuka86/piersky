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

  GITHUB_ROOT = 'https://github.com'

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
  scope :push_event, -> (integration) {
    by_integration(integration).
    where(code: CODES[:push])
  }
  scope :push_to_default_event, -> (integration) {
    by_integration(integration).
    where(code: CODES[:push]).
    joins(:repository).
    where("char_length(substring(activity_githubs.ref, github_repositories.default_branch)) != 0")
  }

  class << self
    def daily_summary(integration)
      obj = {}
      obj[:main] = daily_time_series(integration)

      # commit_obj = {}
      # GithubCommit.
      #   where(ts: SkyModule.yesterday_range).
      #   default_branch,
      #   group_by_author(integration).
      #   count.
      #   each do |author, count|
      #     key = IdentityGithub.find_by('secondary_key=? OR name=?', author, author).try(:id)
      #     if commit_obj[key].present?
      #       commit_obj[key] += count
      #     else
      #       commit_obj[key] ||= count
      #     end
      #   end
      # obj[:commits] = {sentence: 'integration.github.sentence.commits_to_default', query: self.where(ts: SkyModule.yesterday_range).push_to_default_event(integration), count: commit_obj}

      commit_obj = {}
      GithubCommit.
        where(ts: SkyModule.yesterday_range).
        group_by_author(integration).
        count.
        each do |author, count|
          key = IdentityGithub.find_by('secondary_key=? OR name=?', author, author).try(:id)
          if commit_obj[key].present?
            commit_obj[key] += count
          else
            commit_obj[key] ||= count
          end
        end
      obj[:commits] = {sentence: 'integration.github.sentence.commits', query: self.where(ts: SkyModule.yesterday_range).push_event(integration), count: commit_obj}

      comment_q = self.
        where(ts: SkyModule.yesterday_range).
        comment_event(integration)
      obj[:comments] = {sentence: 'integration.github.sentence.comments', query: comment_q, count: comment_q.group(:identity_id).count}

      op_q = self.
        where(ts: SkyModule.yesterday_range, action: 'opened').
        pr_event(integration)
      obj[:opened_prs] = {sentence: 'integration.github.sentence.opened_prs', query: op_q, count: op_q.group(:identity_id).count}

      cp_q = self.
        where(ts: SkyModule.yesterday_range, action: 'closed').
        pr_event(integration)
      obj[:closed_prs] = {sentence: 'integration.github.sentence.closed_prs', query: cp_q, count: cp_q.group(:identity_id).count}

      oi_q = self.
        where(ts: SkyModule.yesterday_range, action: 'opened').
        issues_event(integration)
      obj[:opened_issues] = {sentence: 'integration.github.sentence.opened_issues', query: oi_q, count: oi_q.group(:identity_id).count}

      ci_q = self.
        where(ts: SkyModule.yesterday_range, action: 'closed').
        issues_event(integration)
      obj[:closed_issues] = {sentence: 'integration.github.sentence.closed_issues', query: ci_q, count: ci_q.group(:identity_id).count}

      obj
    end

    def identity_summary(identity, range = SkyModule.yesterday_range)
      obj = {}
      obj[:count] = self.where(ts: range, identity: identity).count

      integration = identity.integration
      return obj if integration.blank?

      commit_obj = {}
      GithubCommit.
        where(ts: range).
        group_by_author(integration).
        count.
        each do |author, count|
          key = IdentityGithub.find_by('secondary_key=? OR name=?', author, author).try(:id)
          if commit_obj[key].present?
            commit_obj[key] += count
          else
            commit_obj[key] ||= count
          end
        end
      obj[:commits] = {sentence: 'integration.github.sentence.commits', query: self.where(ts: SkyModule.yesterday_range).push_event(integration), count: commit_obj[identity.id] || 0}

      comment_q = self.
        where(ts: range, identity: identity).
        comment_event(integration)
      obj[:comments] = {sentence: 'integration.github.sentence.comments', query: comment_q, count: comment_q.count}

      op_q = self.
        where(ts: range, action: 'opened', identity: identity).
        pr_event(integration)
      obj[:opened_prs] = {sentence: 'integration.github.sentence.opened_prs', query: op_q, count: op_q.count}

      cp_q = self.
        where(ts: range, action: 'closed', identity: identity).
        pr_event(integration)
      obj[:closed_prs] = {sentence: 'integration.github.sentence.closed_prs', query: cp_q, count: cp_q.count}

      oi_q = self.
        where(ts: range, action: 'opened', identity: identity).
        issues_event(integration)
      obj[:opened_issues] = {sentence: 'integration.github.sentence.opened_issues', query: oi_q, count: oi_q.count}

      ci_q = self.
        where(ts: range, action: 'closed', identity: identity).
        issues_event(integration)
      obj[:closed_issues] = {sentence: 'integration.github.sentence.closed_issues', query: ci_q, count: ci_q.count}

      obj
    end

    def create_with_webhook(payload, webhook)
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
            activity.commits << GithubCommit.find_or_create!(c, integration, activity)
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
          activity.ts = p["head_commit"].try(:[], "timestamp") || Time.current
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

  def content
    str = case code
    when CODES[:issues] then
      I18n.t('integration.github.template.issue', number: issue.number, name: issue.title)
    when CODES[:pr] then
      I18n.t('integration.github.template.pr', number: pull_request.number, name: pull_request.title)
    when CODES[:commit_comment], CODES[:issue_comment], CODES[:pr_review_comment] then
      I18n.t('integration.github.template.comment', body: comment.body)
    when CODES[:push] then
      messages = commits.map(&:message).reverse.join(', ')
      messages = messages.length > 100 ? "#{messages[0, 100]}..." : messages
      I18n.t('integration.github.template.push', commit_message: messages)
    end

    if !code.in?([CODES[:commit_comment], CODES[:issue_comment], CODES[:pr_review_comment]])
      "<a href='#{SkyModule.mail_log_link(url)}'>#{str}</a>".html_safe
    elsif code.in?([CODES[:commit_comment], CODES[:issue_comment], CODES[:pr_review_comment]])
      "#{str} <a href='#{SkyModule.mail_log_link(url)}'>#{issue.try(:title) || pull_request.try(:title) || commits.last.try(:message)}</a>".html_safe
    else
      "#{str}"
    end
  end

  def url
    base = "#{GITHUB_ROOT}/#{repository.full_name}"
    case code
    when CODES[:issues], CODES[:issue_comment] then
      "#{base}/issues/#{issue.number}"
    when CODES[:pr], CODES[:pr_review_comment] then
      "#{base}/pull/#{pull_request.number}"
    when CODES[:commit_comment] then
      "#{base}/commit/#{commits.first.foreign_id}"
    when CODES[:push] then
      if commits.first.present?
        if commits.first.foreign_id == commits.last.foreign_id
          "#{base}/commit/#{commits.first.foreign_id}"
        else
          "#{base}/compare/#{commits.first.foreign_id}...#{commits.last.foreign_id}"
        end
      else
        ""
      end
    end
  end
end
